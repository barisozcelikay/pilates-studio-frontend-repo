import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuDto } from '../model/menu-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/menu`;

  getMenus(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(this.apiUrl);
  }

  getAllMenus(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${this.apiUrl}/settings`);
  }

  update(menu: MenuDto): Observable<MenuDto> {
    return this.http.put<MenuDto>(this.apiUrl, menu);
  }
}
