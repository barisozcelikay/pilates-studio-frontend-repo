import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuDto } from '../model/menu-dto';


@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/menu';

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
