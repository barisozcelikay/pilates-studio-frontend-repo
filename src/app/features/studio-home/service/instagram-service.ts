import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface InstagramMedia {
  imageUrl: string;
  permalink: string;
  caption: string;
}

@Injectable({ providedIn: 'root' })
export class InstagramService {
  constructor(private readonly http: HttpClient) {}

  findRecentMedia(): Observable<InstagramMedia[]> {
    return this.http.get<InstagramMedia[]>(`${environment.apiUrl}/instagram/recent-media`);
  }
}
