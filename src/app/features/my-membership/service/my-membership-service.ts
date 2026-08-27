import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MemberMeasurementDto } from '../../member-memberships/model/member-measurement-dto';
import { MemberDto } from '../../members/model/member-dto';
import { MembershipDto } from '../../members/service/membership-service';
import { ReservationDto } from '../../reservations/service/reservation-service';

export interface MemberSelfOverviewDto {
  member: MemberDto;
  memberships: MembershipDto[];
  measurements: MemberMeasurementDto[];
  reservations: ReservationDto[];
}

@Injectable({ providedIn: 'root' })
export class MyMembershipService {
  constructor(private readonly http: HttpClient) {}

  getOverview(): Observable<MemberSelfOverviewDto> {
    return this.http.get<MemberSelfOverviewDto>(`${environment.apiUrl}/members/me/overview`);
  }
}
