import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/service/base-service';
import { StudioPackageDto } from '../model/studio-package-dto';
@Injectable({ providedIn: 'root' })
export class StudioPackageService extends BaseService<StudioPackageDto> {
  protected readonly apiUrl = `${environment.apiUrl}/packages`;
  constructor(http: HttpClient) {
    super(http);
  }
}
