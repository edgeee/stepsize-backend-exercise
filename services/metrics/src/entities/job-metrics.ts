import { IsNumber, IsEnum, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProcessingTimeUnit {
  Seconds = 'seconds',
  Milliseconds = 'milliseconds',
}

class ProcessingTimeEntity {
  @IsEnum(ProcessingTimeUnit)
  unit: ProcessingTimeUnit = ProcessingTimeUnit.Seconds;

  @IsNumber()
  totalAverage: number;

  @IsNumber()
  completedAverage: string;

  @IsNumber()
  failedAverage: string;

  @IsDefined()
  averageByComplexity: object;
}

// tslint:disable-next-line
export class JobMetricsEntity {
  @IsNumber()
  totalCompletedJobs: number;

  @IsNumber()
  totalFailedJobs: number;

  @IsNumber()
  percentageFailedJobs: number;

  @Type(() => ProcessingTimeEntity)
  ProcessingTime: ProcessingTimeEntity;
}
