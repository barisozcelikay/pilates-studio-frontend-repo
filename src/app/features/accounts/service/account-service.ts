import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountDto } from '../../../core/auth/model/account-dto';
import { BaseService } from '../../../shared/service/base-service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseService<AccountDto> {
  protected readonly apiUrl = `${environment.apiUrl}/accounts`;

  constructor(http: HttpClient) {
    super(http);
  }
}
