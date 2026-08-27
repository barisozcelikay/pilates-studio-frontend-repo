import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MemberMeasurementDto } from '../model/member-measurement-dto';

@Injectable({ providedIn: 'root' })
export class MemberMeasurementService {
  constructor(private readonly http: HttpClient) {}

  findAll(memberId: number): Observable<MemberMeasurementDto[]> {
    return this.http.get<MemberMeasurementDto[]>(
      `${environment.apiUrl}/members/${memberId}/measurements`,
    );
  }
  create(memberId: number, request: MemberMeasurementDto): Observable<MemberMeasurementDto> {
    return this.http.post<MemberMeasurementDto>(
      `${environment.apiUrl}/members/${memberId}/measurements`,
      request,
    );
  }
  update(
    memberId: number,
    id: number,
    request: MemberMeasurementDto,
  ): Observable<MemberMeasurementDto> {
    return this.http.put<MemberMeasurementDto>(
      `${environment.apiUrl}/members/${memberId}/measurements/${id}`,
      request,
    );
  }
  delete(memberId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/members/${memberId}/measurements/${id}`);
  }
}
