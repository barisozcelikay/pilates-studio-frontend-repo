import { BaseDto } from '../../../shared/model/base-dto';

export class ProfileDto extends BaseDto {
  code = '';
  name = '';
  active = true;
}
