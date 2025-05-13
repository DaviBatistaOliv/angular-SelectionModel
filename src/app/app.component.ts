import { Component } from '@angular/core';
import { DocumentListComponent } from './document/document-list.component';

@Component({
  selector: 'app-root',
  imports: [DocumentListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-SelectionModel';
}
