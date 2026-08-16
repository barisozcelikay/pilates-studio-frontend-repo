import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/service/base-service';
import { InstructorDto } from '../model/instructor-dto';


@Injectable({
  providedIn: 'root',
})
export class InstructorService extends BaseService<InstructorDto> {
  protected readonly apiUrl = `${environment.apiUrl}/instructors`;

  constructor(http: HttpClient) {
    super(http);
  }
}

