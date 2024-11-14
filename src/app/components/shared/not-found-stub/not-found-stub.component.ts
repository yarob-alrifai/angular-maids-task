import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-not-found-stub',
  templateUrl: './not-found-stub.component.html',
  styleUrls: ['./not-found-stub.component.scss'],
  standalone: true,
})
export class NotFoundStubComponent {
  readonly message = input<string | null | undefined>();
  readonly image = input<string | null | undefined>();
  // constructor() {
  //   this.image = '';
  //   this.message = '';
  // }
}
