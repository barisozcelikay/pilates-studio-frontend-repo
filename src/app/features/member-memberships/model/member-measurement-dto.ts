import { BaseDto } from '../../../shared/model/base-dto';

export class MemberMeasurementDto extends BaseDto {
  memberId?: number;
  measuredAt?: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  bodyWaterPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  neckCm?: number;
  armCm?: number;
  thighCm?: number;
  note?: string;
}
