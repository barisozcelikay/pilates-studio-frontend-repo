import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileDto } from '../../../core/auth/model/profile-dto';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/service/base-service';


@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService<ProfileDto> {
  protected readonly apiUrl = `${environment.apiUrl}/profiles`;

  constructor(http: HttpClient) {
    super(http);
  }
}

