import { BaseDto } from '../../../shared/model/base-dto';

export class MemberDto extends BaseDto {
  accountId?: number;
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  status = '';
  membershipStartDate: Date | string | null = null;
  membershipEndDate: Date | string | null = null;
  note = '';
}
