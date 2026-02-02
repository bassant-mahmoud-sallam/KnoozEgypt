import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {

  @Input() rating = 0;   // مثال 4.5
  @Input() max = 5;

  get fullStars(): number[] {
    const full = Math.floor(this.rating);
    return Array.from({ length: Math.min(full, this.max) });
  }

  get hasHalf(): boolean {
    const frac = this.rating - Math.floor(this.rating);
    return frac >= 0.25 && frac < 0.75; // نص نجمة
  }

  get emptyStars(): number[] {
    const full = Math.floor(this.rating);
    const half = this.hasHalf ? 1 : 0;
    const empty = this.max - full - half;
    return Array.from({ length: Math.max(empty, 0) });
  }

}
