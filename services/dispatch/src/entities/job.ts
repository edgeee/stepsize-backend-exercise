import { IsNumber, IsOptional, IsEnum, IsISO8601, IsString } from 'class-validator';

import { BaseEntity } from './base';

export enum JobStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
}

export class Job extends BaseEntity {
  @IsNumber()
  complexity: number;

  @IsString()
  @IsOptional()
  completedAt: string;

  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.Pending;

  async processing() {
    return Job.update(this.id, {
      status: JobStatus.Processing,
    });
  }
  async complete() {
    return Job.update(this.id, {
      status: JobStatus.Completed,
    });
  }
  async failed() {
    return Job.update(this.id, {
      status: JobStatus.Failed,
    });
  }
}
