import { Component, EventEmitter, inject, Input, Output, signal, SimpleChanges, OnInit, OnChanges } from '@angular/core';
@Component({
  selector: 'app-rate-starts',
  imports: [],
  templateUrl: './rate-starts.component.html',
  styleUrl: './rate-starts.component.scss'
})
export class RateStartsComponent implements OnInit , OnChanges{

  @Input() max = 5;
  @Input() alreadyRated = false;
  @Input() initialRating = 0;

  @Output() rateConfirmed = new EventEmitter<number>();

  hovered = signal(0);
  selected = signal(0);
  modalOpen = signal(false);

  ngOnInit() {
    if (this.initialRating > 0) {
      this.selected.set(this.initialRating);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialRating'] && this.initialRating > 0) {
      this.selected.set(this.initialRating);
    }
  }

  displayValue(): number {
    return this.hovered() || this.selected();
  }

  onHover(i: number) {
    if (this.alreadyRated) return;
    this.hovered.set(i);
  }

  onLeave() {
    this.hovered.set(0);
  }

  onPick(i: number) {
    if (this.alreadyRated) return;
    this.selected.set(i);
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  confirm() {
    const value = this.selected();
    if (!value) return;

    this.rateConfirmed.emit(value);
    this.modalOpen.set(false);

    this.alreadyRated = true;
  }

  starsArray(): number[] {
    return Array.from({ length: this.max }, (_, i) => i + 1);
  }

}
