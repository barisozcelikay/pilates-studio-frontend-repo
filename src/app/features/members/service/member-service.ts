import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/service/base-service';
import { MemberDto } from '../model/member-dto';


@Injectable({
  providedIn: 'root',
})
export class MemberService extends BaseService<MemberDto> {
  protected readonly apiUrl = `${environment.apiUrl}/members`;

  constructor(http: HttpClient) {
    super(http);
  }
}

