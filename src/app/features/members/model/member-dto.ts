import { BaseDto } from '../../../shared/model/base-dto';

export class MemberDto extends BaseDto {
  accountId?: number;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  nationalId = '';
  birthDate: Date | string | null = null;
  status = '';
  membershipStartDate: Date | string | null = null;
  membershipEndDate: Date | string | null = null;
  note = '';
}
