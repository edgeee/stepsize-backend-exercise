import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { writer } from '../nsq';
import { Job } from '../entities/job';
import { ResponseSchema } from 'routing-controllers-openapi';
import { JobUpdate } from '../payloads/jobUpdate';

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
    return Job.update(id, job);
  }

  @Delete('/:id')
  @ResponseSchema(Job, {
    description: 'Deletes a job from the datbase, doesnt stop it processing',
  })
  delete(@Param('id') id: string) {
    console.log('Delete');
    return Job.delete(id);
  }
}
