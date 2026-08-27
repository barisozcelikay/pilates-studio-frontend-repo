import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/service/base-service';
import { StudioServiceDto } from '../model/studio-service-dto';
@Injectable({ providedIn: 'root' })
export class StudioServiceService extends BaseService<StudioServiceDto> {
  protected readonly apiUrl = `${environment.apiUrl}/services`;
  constructor(http: HttpClient) {
    super(http);
  }
}
