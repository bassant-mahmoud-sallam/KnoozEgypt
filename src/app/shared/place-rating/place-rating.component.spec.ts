import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceRatingComponent } from './place-rating.component';

describe('PlaceRatingComponent', () => {
  let component: PlaceRatingComponent;
  let fixture: ComponentFixture<PlaceRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
