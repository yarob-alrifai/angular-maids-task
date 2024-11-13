import { Component, computed, viewChild } from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ReactiveFormsModule } from '@angular/forms';

import { User } from '../../../../../state/user';

const ELEMENT_DATA: User[] = [
  {
    id: 1,
    email: 'george.bluth@reqres.in',
    first_name: 'George',
    last_name: 'Bluth',
    avatar: 'https://reqres.in/img/faces/1-image.jpg',
  },
];
@Component({
  selector: 'app-users-list-mock',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatPaginatorModule],

  templateUrl: './users-list-mock.component.html',
  styleUrl: './users-list-mock.component.scss',
})
export class UsersListMockComponent {
  repeatedData: User[] = [];
  repeatCount = 5;

  paginator = viewChild<MatPaginator>(MatPaginator);

  displayedColumns: string[] = [
    'id',
    'avatar',
    'first_name',
    'last_name',
    'email',
  ];

  dataSource = computed<any>(() => {
    return new MatTableDataSource<User>(this.repeatedData);
  });

  ngOnInit(): void {
    for (let i = 0; i < this.repeatCount; i++) {
      this.repeatedData.push(...ELEMENT_DATA); // Use the spread operator to add the items
    }
  }
}
