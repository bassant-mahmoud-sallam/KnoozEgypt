import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { HomeService } from '../../core/services/homeServices/home.service';
import { Iplace } from '../../core/interfaces/iplace';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { RouterLink } from '@angular/router';
import { PlacesService } from '../../core/services/places/places.service';
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-saved-places',
  imports: [NavbarComponent, RouterLink, StarRatingComponent , TranslatePipe],
  templateUrl: './saved-places.component.html',
  styleUrl: './saved-places.component.scss'
})
export class SavedPlacesComponent implements OnInit{

  private readonly userService = inject(UserService);
  private readonly homeService = inject(HomeService);
  private readonly placesService = inject(PlacesService)

  savedPlaces:Iplace[] =[];

  ngOnInit(): void {
    this.getSavePlace();

  }

// get save place api
  getSavePlace(){
    this.userService.getUserInfo().subscribe({
      next:((res) => {
        //console.log(res);
        let userId = res.data.id;
        if(res.success == true) {
          this.homeService.viewUserProfile(userId).subscribe({
            next:((res) => {
              //console.log(res);
              if(res.success == true) {
                console.log(res.data.saved_places);
                this.savedPlaces = res.data.saved_places;
              }
            }),
            error:((err) => {
              console.log(err);
            })
          })

        }
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }


  // save
  toggleSave(p: Iplace, ev: MouseEvent){
    ev.stopPropagation(); // ✅ عشان ميعملش navigate
    p.is_saved = !p.is_saved;

    // call api
    this.placesService.toggleSavePlace(p.id).subscribe({
      next:((res) => {
        console.log(res);

        // update savedPlaces
        this.getSavePlace();

      }),
      error:((err) => {
        console.log(err);
      })
    })
  }

}
