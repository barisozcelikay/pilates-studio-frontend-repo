import { BaseDto } from '../../../shared/model/base-dto';

export class LessonDto extends BaseDto {
  name = '';
  description = '';
  startAt = '';
  endAt = '';
  capacity: number | null = null;
  status = 'ACTIVE';
  instructorIds: number[] = [];
  instructorNames: string[] = [];
}
