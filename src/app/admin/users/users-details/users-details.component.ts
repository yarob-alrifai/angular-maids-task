import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy } from '@angular/core';
import { USER_ENGINE } from '../../../services/interfaces/user.service.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../state/user';
import { ActivatedRoute } from '@angular/router';
import { SpinnerLoaderSAComponent } from '../../../components/shared/spinner/spinner.component';
import { ErrorMessageComponent } from '../../../components/shared/error-message/error-message.component';
@Component({
  selector: 'app-users-details',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    SpinnerLoaderSAComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './users-details.component.html',
  styleUrl: './users-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDetailsComponent {
  readonly #userService = inject(USER_ENGINE);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);

  readonly users = toSignal<User[]>(this.#userService.users$);
  readonly isLoading = toSignal<boolean | null>(this.#userService.isLoading$);
  readonly error = toSignal<string | null>(this.#userService.getError$);

  ngOnInit(): void {
    const id = this.#getUserIdFromParams();
    this.#loadUserData(id);
  }

  // red go back to users list page
  goBack(): void {
    this.#location.back();
  }

  // red get the id for the user from the params

  #getUserIdFromParams(): number {
    const { id } = this.#route.snapshot.params;
    return id;
  }

  // red load user data
  #loadUserData(id: number): void {
    this.#userService.loadUser(id);
  }
}