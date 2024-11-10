import {
  Component,
  computed,
  inject,
  signal,
  viewChild,
  DestroyRef,
} from '@angular/core';
import { User } from '../../../state/user';
import { AfterViewInit } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { USER_ENGINE } from '../../../services/interfaces/user.service.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { SpinnerLoaderSAComponent } from '../../../components/shared/spinner/spinner.component';
import { LOCAL_STORAGE_ENGINE } from '../../../services/interfaces/localStorage.service.interface';
import { ErrorMessageComponent } from '../../../components/shared/error-message/error-message.component';
import { TruncateDirective } from '../../../directives/truncate.directive';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnerLoaderSAComponent,
    ErrorMessageComponent,
    TruncateDirective,
  ],

  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements AfterViewInit {
  length: number | undefined = 50;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageEvent: PageEvent;
  showPageSizeOptions = true;
  searchControl = new FormControl<number | null>(null);

  // red inject services that we will use
  readonly #userService = inject(USER_ENGINE);
  readonly #localStorageService = inject(LOCAL_STORAGE_ENGINE);
  readonly #router = inject(Router);
  // red Used to automatically unsubscribe from observables and clean up resources on component destruction
  readonly #destroyRef = inject(DestroyRef);

  readonly users = toSignal<User[]>(this.#userService.users$);
  readonly totalPages = toSignal<number>(this.#userService.totalPages$);
  readonly totalRecord = toSignal<number>(this.#userService.getTotalRecords$);
  readonly error = toSignal<string | null>(this.#userService.getError$);
  readonly isLoading = toSignal<boolean | null>(this.#userService.isLoading$);

  previousPageSize = signal<number>(5);

  paginator = viewChild<MatPaginator>(MatPaginator);

  displayedColumns: string[] = [
    'id',
    'avatar',
    'first_name',
    'last_name',
    'email',
  ];

  dataSource = computed<any>(() => {
    return new MatTableDataSource<User>(this.users());
  });

  ngOnInit(): void {
    this.#clearCache();
    this.#loadUsersPage(this.pageIndex + 1, this.pageSize);
    this.#listenToSearchControl();
  }

  ngOnDestroy(): void {
    this.#clearCache();
  }

  ngAfterViewInit() {
    this.dataSource().paginator = this.paginator();
    this.#changeRecordsLength();
  }

  #clearCache(): void {
    this.#localStorageService.clearCache();
  }


  //red Load a specific page of users based on the provided page index and page size
  #loadUsersPage(pageIndex: number, pageSize: number): void {
    this.#userService.loadUsersPage(pageIndex, pageSize);
  }


  // red Listen to the search control; triggers a user search whenever the value changes
  #listenToSearchControl(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchValue) => {
          if (this.searchControl.value) {
            const numericValue = this.#convertToNumber(searchValue);
            if (isNaN(numericValue)) {
              return [];
            } else {
              return this.#userService.loadUser(numericValue).pipe(
                catchError(() => {
                  return [];
                }),
              );
            }
          } else {
            this.#loadUsersPage(this.pageIndex + 1, this.pageSize);

            return [];
          }
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  #convertToNumber(value: any): number {
    const numValue = Number(value);
    return isNaN(numValue) ? NaN : numValue;
  }

  #changeRecordsLength(): void {
    setTimeout(() => {
      this.length = this.totalRecord();
    });
  }


  // red for disables the paginator, hides page size options, and disables first/last buttons if there is only one record
  totalRecordIsOne(): boolean {
    return this.users()?.length == 1 ? true : false;
  }

  viewUserDetails(userId: number): void {
    this.#navigateToUserDetailsPage(userId);
  }

  #navigateToUserDetailsPage(userId: number): void {
    this.#router.navigate(['admin/users', userId]);
  }

  #resetToTheFirstPageOnChangingPageSize(): void {
    if (this.pageSize != this.previousPageSize()) {
      this.previousPageSize.set(this.pageSize);
      this.pageIndex = 0;
    }
  }
  handlePageEvent(e: PageEvent) {
    this.#updatePageSizeAndPageIndex(e);
    this.#resetToTheFirstPageOnChangingPageSize();
    this.#loadUsersPage(this.pageIndex + 1, this.pageSize);
  }

  #updatePageSizeAndPageIndex(e: PageEvent): void {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }
}
