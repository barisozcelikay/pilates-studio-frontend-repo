import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { BaseDto } from '../../shared/model/base-dto';
import { BaseService } from '../../shared/service/base-service';
import { environment } from '../../../environments/environment';

export type PaymentMethod = 'CASH' | 'CARD';
export type PaymentStatus = 'PAID' | 'UNPAID';

export class PaymentDto extends BaseDto {
  membershipId: number | null = null;
  memberName = '';
  packageName = '';
  amount: number | null = null;
  paymentMethod: PaymentMethod | null = null;
  status: PaymentStatus = 'UNPAID';
  paidAt: string | null = null;
  note = '';
}

export interface PaymentOptionDto {
  membershipId: number;
  memberName: string;
  packageName: string;
  price: number;
  displayLabel?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<PaymentDto> {
  protected readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(http: HttpClient) {
    super(http);
  }

  findOptions(): Observable<PaymentOptionDto[]> {
    return this.http.get<PaymentOptionDto[]>(`${this.apiUrl}/options`);
  }

  override create(request: PaymentDto): Observable<PaymentDto> {
    return this.http.post<PaymentDto>(this.apiUrl, this.toRequest(request));
  }

  override update(request: PaymentDto): Observable<PaymentDto> {
    if (!request.id) {
      return throwError(() => new Error('Ödeme kaydı bulunamadı.'));
    }

    return this.http.put<PaymentDto>(`${this.apiUrl}/${request.id}`, this.toRequest(request));
  }

  private toRequest(payment: PaymentDto): object {
    return {
      membershipId: payment.membershipId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      note: payment.note,
    };
  }
}
