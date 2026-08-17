import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LessonDto } from '../../lessons/model/lesson-dto';


@Injectable({
  providedIn: 'root',
})
export class CalendarService {

  constructor(private readonly http: HttpClient) {}

  findLessons(): Observable<LessonDto[]> {
    return this.http.get<LessonDto[]>(`${environment.apiUrl}/lessons`);
  }
}
