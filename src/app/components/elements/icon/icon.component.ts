import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class IconComponent {
  @Input() type: 'tech' | 'slots' | 'salvage' | 'cargo' | 'recommended' | null = null;
  @Input() value: number | null = null;
  @Input() warning: boolean = false;
}
