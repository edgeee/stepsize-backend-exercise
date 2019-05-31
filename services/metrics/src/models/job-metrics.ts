import redisClient from '../redis';
import { Job } from '../../shared/dispatch-client/model/models';

const keys = {
  failedJobsCount: 'failed_jobs_count',
  completedJobsCount: 'completed_jobs_count',
  jobsProcessingDuration: 'jobs_processing_duration',
};

interface JobsProcessingDurationInterface {
  all: { sum: number, totalCount: number };
  failed: { sum: number, totalCount: number };
  completed: { sum: number, totalCount: number };
  byComplexity: {
    [key: number]: { sum: number, totalCount: number },
  };
}

export class JobMetrics {

  private static name_ = 'metrics'; // tslint:disable-line
  private static activeJobsStartTimeMap = new Map<string, number>();

  private static async getNumericValue(key: string): Promise<number> {
    const n = await redisClient().hget(this.name_, key);
    if (!n) {
      return 0;
    }
    return JSON.parse(n);
  }

  static async completedJobsCount(): Promise<number> {
    return this.getNumericValue(keys.completedJobsCount);
  }

  static async failedJobsCount(): Promise<number> {
    return this.getNumericValue(keys.failedJobsCount);
  }

  static async percentageFailedJobs(): Promise<number> {
    const failed = await this.failedJobsCount();
    const completed = await this.completedJobsCount();
    const total =  failed + completed;
    if (total === 0) {
      return 0.0;
    }
    return +(failed / total * 100).toFixed(2);
  }

  private static async jobsProcessingTime(): Promise<JobsProcessingDurationInterface> {
    const val = await redisClient().hget(this.name_, keys.jobsProcessingDuration);
    if (!val) {
      return {
        all: { sum: 0, totalCount: 0 },
        failed: { sum: 0, totalCount: 0 },
        completed: { sum: 0, totalCount: 0 },
        byComplexity: {},
      };
    } else {
      return JSON.parse(val) as JobsProcessingDurationInterface;
    }
  }

  static async getAverageProcessingTime(): Promise<object> {
    const avg = (pt: { sum: number, totalCount: number}): number => {
      return +((pt.sum / pt.totalCount) || 0).toFixed(2);
    };

    const processingTime = await this.jobsProcessingTime();
    const ret = {} as any;
    ret.unit = 'seconds';
    ret.totalAverage = avg(processingTime.all);
    ret.completedAverage = avg(processingTime.completed);
    ret.failedAverage = avg(processingTime.failed);
    ret.averageByComplexity = {};

    for (const key of Object.keys(processingTime.byComplexity)) {
      ret.averageByComplexity[key] = avg(processingTime.byComplexity[key]);
    }
    return ret;
  }

  static async onJobStart(job: Job, startedAtTimestamp: number) {
    this.activeJobsStartTimeMap.set(job.id, startedAtTimestamp);
  }

  static async onJobEnd(job: Job, endedAtTimestamp: number) {
    let jobExecutionDuration = 0;
    const startedAtTimestamp: number = this.activeJobsStartTimeMap.get(job.id);
    if (startedAtTimestamp) {
      jobExecutionDuration = +((endedAtTimestamp - startedAtTimestamp) / 1000).toFixed(2);
    }
    this.activeJobsStartTimeMap.delete(job.id);

    const processingTime = await this.jobsProcessingTime();
    processingTime.all.sum += jobExecutionDuration;
    processingTime.all.totalCount += 1;

    if (job.status === Job.StatusEnum.Completed) {
      await redisClient().hset(
        this.name_,
        keys.completedJobsCount,
        await this.completedJobsCount() + 1,
      );
      processingTime.completed.sum += jobExecutionDuration;
      processingTime.completed.totalCount += 1;
    } else {
      await redisClient().hset(
        this.name_,
        keys.failedJobsCount,
        await this.failedJobsCount() + 1,
      );
      processingTime.failed.sum += jobExecutionDuration;
      processingTime.failed.totalCount += 1;
    }

    if (!processingTime.byComplexity[job.complexity]) {
      processingTime.byComplexity[job.complexity] = { sum: 0, totalCount: 0 };
    }

    processingTime.byComplexity[job.complexity].sum += jobExecutionDuration;
    processingTime.byComplexity[job.complexity].totalCount += 1;

    redisClient().hset(
      this.name_,
      keys.jobsProcessingDuration,
      JSON.stringify(processingTime),
    );
  }
}
