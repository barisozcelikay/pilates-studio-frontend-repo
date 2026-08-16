import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/service/base-service';
import { LessonDto } from '../model/lesson-dto';


@Injectable({
  providedIn: 'root',
})
export class LessonService extends BaseService<LessonDto> {
  protected readonly apiUrl = `${environment.apiUrl}/lessons`;

  constructor(http: HttpClient) {
    super(http);
  }
}

