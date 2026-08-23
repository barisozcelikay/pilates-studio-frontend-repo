import { BaseDto } from '../../../shared/model/base-dto';

export class StudioPackageDto extends BaseDto {
  code = '';
  name = '';
  description?: '';
  durationDays = 0;
  sessionCount = 0;
  cancellationRightCount = 0;
  price = 0;
  active = true;
}
