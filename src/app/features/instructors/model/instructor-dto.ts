import { BaseDto } from '../../../shared/model/base-dto';

export class InstructorDto extends BaseDto {
  accountId?: number;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  status = '';
  specialty = '';
  biography = '';
}
