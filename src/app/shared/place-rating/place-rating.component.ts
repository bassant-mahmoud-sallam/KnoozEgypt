import { Component, Input} from '@angular/core';
import { PlaceRate } from '../../core/interfaces/place-rate';
import { StarRatingComponent } from "../star-rating/star-rating.component";

@Component({
  selector: 'app-place-rating',
  imports: [StarRatingComponent],
  templateUrl: './place-rating.component.html',
  styleUrl: './place-rating.component.scss'
})
export class PlaceRatingComponent{
  @Input({ required: true }) rates: PlaceRate[] = [];

}
