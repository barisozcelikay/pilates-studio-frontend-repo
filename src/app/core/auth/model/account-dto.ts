import { BaseDto } from '../../../shared/model/base-dto';

export class AccountDto extends BaseDto {
  email = '';
  phone = '';
  firstName = '';
  lastName = '';
  active = true;
  lastLoginAt: string | null = null;
  profileId: number | null = null;
  packageId: number | null = null;
  profileName = '';
  status: 'ACTIVE' | 'PASSIVE' | 'EMAIL_CONFIRMATION_PENDING' = 'EMAIL_CONFIRMATION_PENDING';
}
