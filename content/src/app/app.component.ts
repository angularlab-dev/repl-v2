import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'apli';
  count = 0;

  increment() {
    this.count++;
  }
}
