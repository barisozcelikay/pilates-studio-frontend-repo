import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseDto } from '../../shared/model/base-dto';
import { BaseService } from '../../shared/service/base-service';

export type ContactRequestStatus = 'NEW' | 'CONTACTED' | 'CLOSED';

export interface ContactRequestPayload {
  fullName: string;
  email: string;
  phone: string;
  note: string;
  /** Honeypot: must stay empty. Hidden from real visitors via CSS. */
  website?: string;
}

export class ContactRequestDto extends BaseDto implements ContactRequestPayload {
  fullName = '';
  email = '';
  phone = '';
  note = '';
  status: ContactRequestStatus = 'NEW';
}

@Injectable({ providedIn: 'root' })
export class ContactRequestService extends BaseService<ContactRequestDto> {
  protected readonly apiUrl = `${environment.apiUrl}/contact-requests`;

  constructor(http: HttpClient) {
    super(http);
  }

  override create(request: ContactRequestPayload): Observable<ContactRequestDto> {
    return this.http.post<ContactRequestDto>(this.apiUrl, request);
  }

  updateStatus(id: number, status: ContactRequestStatus): Observable<ContactRequestDto> {
    return this.http.patch<ContactRequestDto>(`${this.apiUrl}/${id}/status`, { status });
  }
}
