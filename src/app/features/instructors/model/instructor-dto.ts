import { BaseDto } from '../../../shared/model/base-dto';

export class InstructorDto extends BaseDto {
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  active = true;
}
