import { Component, inject, OnInit } from '@angular/core';
import { PlacesService } from '../../core/services/places/places.service';
import { Iplace } from '../../core/interfaces/iplace';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";
import { SearchPipe } from "../../shared/pipe/search.pipe";
import { RouterLink} from "@angular/router";

@Component({
  selector: 'app-recommendation',
  imports: [NavbarComponent, FormsModule, StarRatingComponent, SearchPipe , RouterLink],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent implements OnInit{

  placesService = inject(PlacesService);

  allRecommendedPlaces:Iplace[]=[];
  textInput:string ='';

  ngOnInit(): void {
    this.placesService.getRecommenedPlaces().subscribe({
      next:((res) => {
        console.log(res.data.places);
        if(res.success == true) {
          this.allRecommendedPlaces = res.data.places;
        }
      }),
      error:((err) => {
        console.log(err);
      })
    })

  }

}
