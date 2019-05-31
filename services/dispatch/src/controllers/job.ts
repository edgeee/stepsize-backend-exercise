import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { writer } from '../nsq';
import { Job, JobStatus } from '../entities/job';
import { ResponseSchema } from 'routing-controllers-openapi';
import { JobUpdate } from '../payloads/jobUpdate';

const RETRY_JOB_THRESHOLD = 10 /*  Rety jobs this many times */
const RETRY_JOB_INTERVAL = 5000 /* in ms */

@JsonController('/job')
export class JobController {
  @Get('/')
  @ResponseSchema(Job, {
    isArray: true,
    description: 'A list of all jobs currently saved in the database',
  })
  async getAll() {
    return Job.getAll();
  }

  @Get('/:id')
  @ResponseSchema(Job, {
    description: 'The specified job',
  })
  async getOne(@Param('id') id: string) {
    return Job.get(id);
  }

  @Post('/')
  @ResponseSchema(Job, {
    description: 'Creates a new job and starts processing it',
  })
  async create(@Body() job: Job) {
    await job.save();
    writer.publish('job_run', job);
    return job;
  }

  @Put('/:id')
  @ResponseSchema(Job, {
    description: 'The updated job',
  })
  async update(@Param('id') id: string, @Body() job: JobUpdate) {
    const updated = await Job.update(id, job);
    if (updated.status === JobStatus.Failed) {
      this.retryJob(await Job.get(id));
    }
    return updated;
  }

  @Delete('/:id')
  @ResponseSchema(Job, {
    description: 'Deletes a job from the datbase, doesnt stop it processing',
  })
  delete(@Param('id') id: string) {
    console.log('Delete');
    return Job.delete(id);
  }

  private async retryJob(job: Job) {
    if (job.retries >= RETRY_JOB_THRESHOLD) {
      return;
    }
    setTimeout(async () => {
      await Job.update(job.id, {
        retries: job.retries + 1
      });

      writer.publish('job_run', job);
    }, job.retries * RETRY_JOB_INTERVAL);
  }
}
