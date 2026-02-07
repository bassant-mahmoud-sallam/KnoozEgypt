import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearByRestaurantsComponent } from './near-by-restaurants.component';

describe('NearByRestaurantsComponent', () => {
  let component: NearByRestaurantsComponent;
  let fixture: ComponentFixture<NearByRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearByRestaurantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearByRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
