import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { PlacesService } from '../../core/services/places/places.service';
import { Iplace } from '../../core/interfaces/iplace';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-near-by-restaurants',
  imports: [NavbarComponent, StarRatingComponent , RouterLink , TranslatePipe],
  templateUrl: './near-by-restaurants.component.html',
  styleUrl: './near-by-restaurants.component.scss'
})
export class NearByRestaurantsComponent {

  private readonly activatedRoutect = inject(ActivatedRoute);
  private readonly CategoriesService = inject(CategoriesService);
  private readonly placesService = inject(PlacesService)

  nearstResturant:Iplace[] =[];
  resturantsId:string='6';

  placeId:string='';
  governorateId:string='';

  textInput:string = '';

  ngOnInit(): void {
    this.activatedRoutect.paramMap.subscribe({
      next:((p) => {
        //console.log(p.get('governorateId'));
        this.governorateId = p.get('governorateId')!;
        this.placeId = p.get('placeId')!;

        // call api
        this.CategoriesService.getPlacesbyCategory(this.resturantsId! , this.governorateId).subscribe({
          next:((res) => {
            console.log(res);
            this.nearstResturant = res.data.places;
          }),
          error:((err) => {
            console.log(err);
          })
        })
      })
    })
  }


  // save
  toggleSave(p: Iplace, ev: MouseEvent){
    ev.stopPropagation();
    p.is_saved = !p.is_saved;

    // call api
    this.placesService.toggleSavePlace(p.id).subscribe({
      next:((res) => {
        console.log(res);
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }

}
