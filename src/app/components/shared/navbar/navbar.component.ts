import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, MatToolbar, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly #router = inject(Router);

  isActive(route: string): boolean {
    return this.#router.url.startsWith(route);
  }
}
