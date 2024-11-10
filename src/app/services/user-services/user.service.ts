import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngxs/store';
import { LoadUser, loadUsersPage, User, UserState } from '../../state/user';
import { UserEngine } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements UserEngine {
  readonly #store = inject(Store);

  readonly users$: Observable<User[]> = this.#store.select(UserState.getUsers);
  readonly getTotalRecords$: Observable<number> = this.#store.select(
    UserState.getTotalRecords,
  );
  readonly totalPages$: Observable<number> = this.#store.select(
    UserState.getTotalPages,
  );
  readonly getError$: Observable<string | null> = this.#store.select(
    UserState.getError,
  );
  readonly isLoading$: Observable<boolean | null> = this.#store.select(
    UserState.isLoading,
  );

  loadUser = (userId: number): Observable<void> =>
    this.#store.dispatch(new LoadUser(userId));
  loadUsersPage = (pageNumber: number, perPage: number): Observable<void> =>
    this.#store.dispatch(new loadUsersPage(pageNumber, perPage));
}
