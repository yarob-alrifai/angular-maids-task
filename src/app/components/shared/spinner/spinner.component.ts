import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-ui-spinner-loader',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerLoaderSAComponent {
  private _duration: number = 1000;
  private _showBorder: boolean = false;

  @Input()
  set duration(value: number) {
    this._duration = value >= 0 ? value : 1000;
  }

  get duration(): number {
    return this._duration;
  }

  @Input()
  set showBorder(value: boolean) {
    this._showBorder = value;
  }

  get showBorder(): boolean {
    return this._showBorder;
  }

  @HostBinding('style.--duration') get durationStyle(): string {
    return `${this.duration}ms`;
  }
}
