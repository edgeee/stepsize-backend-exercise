import { JsonController, Get } from 'routing-controllers';
import { JobMetrics } from '../models/job-metrics';
import { jobReader } from '../nsq';
import { Job } from '../../shared/dispatch-client/model/models';
import { ResponseSchema } from 'routing-controllers-openapi';
import { JobMetricsEntity } from '../entities/job-metrics';

jobReader.on('message', (msg) => {
  const { job, changeTimestamp } = JSON.parse(msg.body.toString());

  if (job.status === Job.StatusEnum.Processing) {
    JobMetrics.onJobStart(job, changeTimestamp);
  } else if ([Job.StatusEnum.Failed, Job.StatusEnum.Completed].includes(job.status)) {
    JobMetrics.onJobEnd(job, changeTimestamp);
  }
});

@JsonController('/metrics')
export class JobMetricsController {

  @Get('/jobs')
  @ResponseSchema(JobMetricsEntity, {
    description: 'Metrics from the job dispatcher service',
  })
  async getjobMetrics() {
    return {
      totalCompletedJobs: await JobMetrics.completedJobsCount(),
      totalFailedJobs: await JobMetrics.failedJobsCount(),
      percentageFailedJobs: await JobMetrics.percentageFailedJobs(),
      processingTime: await JobMetrics.getAverageProcessingTime(),
    };
  }
}
