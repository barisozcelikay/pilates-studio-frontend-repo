import { BaseDto } from '../../../shared/model/base-dto';

export class LessonDto extends BaseDto {
  name = '';
  description = '';
  startAt: Date | string | null = null;
  endAt: Date | string | null = null;
  capacity: number | null = null;
  status = 'ACTIVE';
  instructorIds: number[] = [];
  instructorNames: string[] = [];
  serviceIds: number[] = [];
  serviceNames: string[] = [];
  reservationCount = 0;
}
