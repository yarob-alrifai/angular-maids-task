import { Component } from '@angular/core';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-users-details-mock',
  standalone: true,
  imports: [],
  templateUrl: './users-details-mock.component.html',
  styleUrl: './users-details-mock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersDetailsMockComponent {
  users = [
    {
      id: 1,
      email: 'george.bluth@reqres.in',
      first_name: 'George',
      last_name: 'Bluth',
      avatar: 'https://reqres.in/img/faces/1-image.jpg',
    },
  ];
}
