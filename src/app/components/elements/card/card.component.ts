import { Component, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent
],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() titleText: string = '';
  @Input() titleIcon: string = '';
  @Input() titleIconText: string = '';

  @Input() titleIconType: 'tech' | 'slots' | 'salvage' | 'cargo' | null = null;
  @Input() titleIconValue: number | null = null;
  @Input() titleIconValue2: number | null = null;
}
