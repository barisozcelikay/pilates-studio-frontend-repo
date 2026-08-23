import { BaseDto } from '../../../shared/model/base-dto';

export class MemberMeasurementDto extends BaseDto {
  memberId?: number;
  measuredAt?: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  note?: string;
}
