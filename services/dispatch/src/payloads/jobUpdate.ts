import { IsNumber, IsOptional, IsEnum, IsString } from 'class-validator';
import { JobStatus } from '../entities/job';

export class JobUpdate {
  @IsNumber()
  @IsOptional()
  complexity: number;

  @IsString()
  @IsOptional()
  completedAt: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status: JobStatus = JobStatus.Pending;
}
