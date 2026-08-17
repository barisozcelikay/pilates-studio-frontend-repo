import { BaseDto } from '../../../shared/model/base-dto';

export class MemberDto extends BaseDto {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  active = true;
}
