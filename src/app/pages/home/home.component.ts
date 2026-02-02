import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { HomeService } from '../../core/services/homeServices/home.service';
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";
import { RouterLink} from "@angular/router";
import { IcategoryHome } from '../../core/interfaces/icategory-home';
import { Iplace } from '../../core/interfaces/iplace';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, StarRatingComponent , RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  homeService = inject(HomeService);

  categoriesHome:IcategoryHome[] = [];
  recommendPlacesHome:Iplace[] = [];


  ngOnInit(): void {
    this.homeService.getHomeData().subscribe({
      next: ((res) => {
        console.log(res.data.categories);
        console.log(res.data.recommended_places);
        this.categoriesHome = res.data.categories;
        this.recommendPlacesHome = res.data.recommended_places;
      }),
      error: ((err) => {
        console.log(err);
      })
    })

  }

}
