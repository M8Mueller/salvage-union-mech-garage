import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ep-tag',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './ep-tag.component.html',
  styleUrl: './ep-tag.component.css'
})
export class EpTagComponent {
  @Input() epCost: string | number = 0;

}
