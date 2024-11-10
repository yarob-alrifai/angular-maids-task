import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../state/user/user.model';

export const USER_ENGINE = new InjectionToken<UserEngine>('USER_ENGINE');

export interface UserEngine {
  readonly users$: Observable<User[]>;
  readonly getTotalRecords$: Observable<number> ;
  readonly totalPages$: Observable<number> ;
  readonly getError$: Observable<string | null> ;
  readonly isLoading$: Observable<boolean | null> ;

  loadUser(userId: number): Observable<void>;
  loadUsersPage(pageNumber: number,perPage:number): Observable<void>;


}
