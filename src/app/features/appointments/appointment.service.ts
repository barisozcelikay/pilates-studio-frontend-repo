import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseDto } from '../../shared/model/base-dto';
import { BaseService } from '../../shared/service/base-service';

export type AppointmentStatus = 'SCHEDULED' | 'CONTACTED' | 'CANCELLED';

export interface AppointmentPayload {
  fullName: string;
  email: string;
  phone: string;
  appointmentAt: string;
  note?: string;
  status?: AppointmentStatus;
}

export class AppointmentDto extends BaseDto implements AppointmentPayload {
  fullName = '';
  email = '';
  phone = '';
  appointmentAt = '';
  note = '';
  status: AppointmentStatus = 'SCHEDULED';
}

@Injectable({ providedIn: 'root' })
export class AppointmentService extends BaseService<AppointmentDto> {
  protected readonly apiUrl = `${environment.apiUrl}/appointments`;

  constructor(http: HttpClient) {
    super(http);
  }

  findByRange(from: string | null, to: string | null): Observable<AppointmentDto[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<AppointmentDto[]>(this.apiUrl, { params });
  }
}
