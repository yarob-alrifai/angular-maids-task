import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../state/user';
export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}
@Injectable({
  providedIn: 'root',
})
export class UserBackendService {
  private apiUrl = 'https://reqres.in/api/users';
  readonly #httpClient = inject(HttpClient);



  loadUsersPage(
    page: number = 1,
    perPage: number = 6,
  ): Observable<PaginatedResponse<User>> {
    return this.#httpClient
      .get<
        PaginatedResponse<User>
      >(`${this.apiUrl}?page=${page}&per_page=${perPage}`)
      .pipe(map((response) => response));
  }
  loadUser(id: number = 1): Observable<PaginatedResponse<User>> {
    return this.#httpClient
      .get<PaginatedResponse<User>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response));
  }
}
