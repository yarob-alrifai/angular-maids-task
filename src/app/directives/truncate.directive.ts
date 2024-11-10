import { Directive, ElementRef, Renderer2, inject, input } from '@angular/core';

@Directive({
  selector: '[appTruncate]',
  standalone: true,
})
export class TruncateDirective {
  // maxWidth = input<string>('200px');
  truncateLength = input<number>(20);
  ellipsis = input<string>('....');

  readonly #el = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  ngOnInit(): void {
    this.applyTruncate();
  }

  private applyTruncate() {
    const nativeElement = this.#el.nativeElement;
    const textContent = nativeElement.textContent || nativeElement.innerText;

    if (textContent.length > this.truncateLength()) {
      nativeElement.textContent =
        textContent.slice(0, this.truncateLength()) + this.ellipsis();
    }

    this.#renderer.setStyle(nativeElement, 'white-space', 'nowrap');
    this.#renderer.setStyle(nativeElement, 'overflow', 'hidden');
    this.#renderer.setStyle(nativeElement, 'text-overflow', 'ellipsis');
    // this.#renderer.setStyle(nativeElement, 'max-width', this.maxWidth());
  }
}
