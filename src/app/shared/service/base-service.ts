import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseDto } from '../model/base-dto';

export abstract class BaseService<T extends BaseDto> {
  protected abstract readonly apiUrl: string;

  protected constructor(
    protected readonly http: HttpClient,
  ) {}



  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(request: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, request);
  }

  update(request: T): Observable<T> {
    return this.http.put<T>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
