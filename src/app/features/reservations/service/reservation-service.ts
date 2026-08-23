import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReservationDto {
  id: number;
  memberId: number;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  membershipId: number;
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private readonly http: HttpClient) {}

  findAllByLessonId(lessonId: number): Observable<ReservationDto[]> {
    return this.http.get<ReservationDto[]>(`${environment.apiUrl}/lessons/${lessonId}/reservations`);
  }

  create(lessonId: number, memberId?: number | null): Observable<ReservationDto> {
    return this.http.post<ReservationDto>(`${environment.apiUrl}/reservations`, {
      lessonId,
      ...(memberId ? { memberId } : {}),
    });
  }

  markAttended(reservationId: number): Observable<ReservationDto> {
    return this.http.post<ReservationDto>(`${environment.apiUrl}/reservations/${reservationId}/attend`, {});
  }

  cancel(reservationId: number): Observable<ReservationDto> {
    return this.http.post<ReservationDto>(`${environment.apiUrl}/reservations/${reservationId}/cancel`, {});
  }
}
