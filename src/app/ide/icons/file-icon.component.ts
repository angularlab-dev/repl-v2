import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'file-icon',
  template: `
    <img style="width: 20px; display: inline;" src="/{{type}}.png" />
  `,
})
export class FileIconComponent {
  @Input() type: string | undefined;
}
