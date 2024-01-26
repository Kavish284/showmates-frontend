import { Component } from '@angular/core';

@Component({
  selector: 'app-pre-loader',
  templateUrl: './pre-loader.component.html',
  styleUrls: ['./pre-loader.component.css']
})
export class PreLoaderComponent {
  isLoading = true;

  ngOnInit() {
    // Simulating a delay and then hiding the pre-loader
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
