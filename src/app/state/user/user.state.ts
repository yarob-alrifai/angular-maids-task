import { State, Action, StateContext, Selector } from '@ngxs/store';
import { inject, Injectable } from '@angular/core';
import { loadUsersPage, LoadUser } from './user.actions';
import { User, UserStateModel, USER_INITIAL_STATE } from './user.model';
import {
  PaginatedResponse,
  UserBackendService,
} from '../../services/backend-services/user-backend.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LOCAL_STORAGE_ENGINE } from '../../services/interfaces/localStorage.service.interface';

@State<UserStateModel>({
  name: 'user',
  defaults: USER_INITIAL_STATE,
})
@Injectable()
export class UserState {
  readonly #userBackendService = inject(UserBackendService);

  @Selector()
  static getUsers(state: UserStateModel): User[] {
    return state.users;
  }

  @Selector()
  static getTotalRecords(state: UserStateModel): number {
    return state.totalRecords;
  }
  @Selector()
  static getTotalPages(state: UserStateModel): number {
    return state.totalPages;
  }

  @Selector()
  static isLoading(state: UserStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static getError(state: UserStateModel): string | null {
    return state.error;
  }

  readonly #localStorageService = inject(LOCAL_STORAGE_ENGINE);

  @Action(LoadUser)
  LoadUser(
    { patchState, getState }: StateContext<UserStateModel>,
    { userId }: LoadUser,
  ): Observable<PaginatedResponse<User>> {
    patchState({ isLoading: true, error: null });
    // red check if the user already in the users list
    const cachedUser = getState().users.find((user) => user.id === userId);
    if (cachedUser) {
      patchState({
        users: [cachedUser],
        isLoading: false,
        error: null,
      });

      return of(null as unknown as PaginatedResponse<User>);
    }
    // red Request the user from the backend
    return this.#userBackendService.loadUser(userId).pipe(
      tap((response: PaginatedResponse<User>) => {
        let users: User[] = [];
        // red Normalize response data by ensuring it's an array, then pass it to the component
        if (Array.isArray(response.data)) {
          users = response.data;
        } else if (response.data) {
          users = [response.data];
        }

        patchState({
          users: users,
          isLoading: false,
          error: null,
        });
      }),
      catchError((error: HttpErrorResponse) => {
        //red  Handle 404 or 503 error by updating state to indicate user not found
        if (this.#isError(error)) {
          patchState({
            isLoading: false,
            users: [],
            error: 'Sorry, user not found, try another ID',
          });
        } else {
          patchState({
            isLoading: false,
            users: [],
            error: 'Failed to fetch users',
          });
        }
        return throwError(error);
      }),
    );
  }

  // red Loud users page
  @Action(loadUsersPage)
  loadUsersPage(
    { patchState }: StateContext<UserStateModel>,
    { pageNumber, perPage }: loadUsersPage,
  ): Observable<PaginatedResponse<User>> {
    patchState({ isLoading: true, error: null });

    // red Check if the requested page data is available in cache
    const cacheKey = this.#getCacheKey(pageNumber, perPage);
    const cachedData = this.#getCachedData(cacheKey);

    if (cachedData) {
      patchState({
        users: cachedData.users,
        totalPages: cachedData.totalPages,
        isLoading: false,
        error: null,
      });
      return of(null as unknown as PaginatedResponse<User>);
    }

    // red Request the page from the backend
    return this.#userBackendService.loadUsersPage(pageNumber, perPage).pipe(
      tap((response: PaginatedResponse<User>) => {
        const cachedPerPage =
          this.#localStorageService.getCachedData('perPage');
        // red Clear cache if the user has changed the page size to ensure fresh data is loaded
        if (cachedPerPage && cachedPerPage !== perPage) {
          this.#clearCache();
        }

        patchState({
          users: response.data,
          totalRecords: response.total,
          totalPages: response.total_pages,
          page: response.page,
          isLoading: false,
          error: null,
        });
        // red Store the response data in the cache with the current cacheKey and perPage
        this.#storeDataInCache(response, cacheKey, perPage);
      }),

      catchError((error) => {
        patchState({
          isLoading: false,
          error: 'Failed to fetch users',
        });
        return throwError(error);
      }),
    );
  }

  #isError(error: HttpErrorResponse): boolean {
    return error.status === 404 || error.status === 503;
  }

  #getCacheKey(pageNumber: number, perPage: number): string {
    return `page:${pageNumber}_perPage:${perPage}`;
  }
  #getCachedData(key: string): any {
    this.#localStorageService.getCachedData(key);
  }

  #clearCache(): void {
    this.#localStorageService.clearCache();
  }

  #setCacheData(key: string, data: any): void {
    this.#localStorageService.setCachedData(key, data);
  }

  #storeDataInCache(
    response: PaginatedResponse<User>,
    cacheKey: string,
    perPage: number,
  ): void {
    const dataToCache = {
      users: response.data,
      totalRecords: response.total,
      totalPages: response.total_pages,
    };
this.#setCacheData(cacheKey,dataToCache)
this.#setCacheData('perPage',perPage)

  }
}
