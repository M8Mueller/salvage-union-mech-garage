import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trait-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './trait-list.component.html',
  styleUrl: './trait-list.component.css'
})
export class TraitListComponent {
  @Input() traits: string[] = [];

}
