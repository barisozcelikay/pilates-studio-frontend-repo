import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MembershipDto {
  id?: number;
  packageId: number;
  packageName: string;
  totalSessionCount: number;
  remainingSessionCount: number;
  totalCancellationRightCount: number;
  remainingCancellationRightCount: number;
  startDate: string;
  endDate: string;
  status: string;
}
export interface MembershipRightsUpdateRequest {
  remainingSessionCount: number;
  remainingCancellationRightCount: number;
}

@Injectable({ providedIn: 'root' })
export class MembershipService {
  constructor(private readonly http: HttpClient) {}
  findAll(memberId: number): Observable<MembershipDto[]> {
    return this.http.get<MembershipDto[]>(`${environment.apiUrl}/members/${memberId}/memberships`);
  }
  create(memberId: number, packageId: number): Observable<MembershipDto> {
    return this.http.post<MembershipDto>(
      `${environment.apiUrl}/members/${memberId}/memberships?packageId=${packageId}`,
      {},
    );
  }
  updateRights(
    memberId: number,
    membershipId: number,
    request: MembershipRightsUpdateRequest,
  ): Observable<MembershipDto> {
    return this.http.put<MembershipDto>(
      `${environment.apiUrl}/members/${memberId}/memberships/${membershipId}/rights`,
      request,
    );
  }
}
