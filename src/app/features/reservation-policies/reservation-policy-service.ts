import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseDto } from '../../shared/model/base-dto';
import { BaseService } from '../../shared/service/base-service';

export class ReservationPolicyDto extends BaseDto {
  name = '';
  freeCancellationEnabled = true;
  cancellationDeadlineMinutes = 240;
  latestReservationEnabled = true;
  latestReservationMinutes = 10;
  active = true;
}

@Injectable({ providedIn: 'root' })
export class ReservationPolicyService extends BaseService<ReservationPolicyDto> {
  protected readonly apiUrl = `${environment.apiUrl}/reservation-policies`;

  constructor(http: HttpClient) {
    super(http);
  }

  override update(request: ReservationPolicyDto): Observable<ReservationPolicyDto> {
    if (!request.id) {
      return throwError(() => new Error('Rezervasyon kuralı bulunamadı.'));
    }
    return this.http.put<ReservationPolicyDto>(`${this.apiUrl}/${request.id}`, request);
  }
}
