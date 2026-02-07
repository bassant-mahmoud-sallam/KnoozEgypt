import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { PlacesService } from '../../core/services/places/places.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IplaceDetails } from '../../core/interfaces/iplace-details';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { TranslatePipe } from '@ngx-translate/core';
import { RateStartsComponent } from "../../shared/rate-starts/rate-starts.component";
import { UserService } from '../../core/services/user/user.service';
import { PlaceRatingComponent } from "../../shared/place-rating/place-rating.component";
import { PlaceRate } from '../../core/interfaces/place-rate';

@Component({
  selector: 'app-place-details',
  imports: [NavbarComponent, StarRatingComponent, TranslatePipe, RateStartsComponent, PlaceRatingComponent, RouterLink],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent  implements OnInit{

  private readonly placesService = inject(PlacesService);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly sanitizer = inject(DomSanitizer);

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  private readonly userService = inject(UserService);

  placeDetails!:IplaceDetails;

  from!:string;
  categoryId!:string;
  backRecommend!:string;

  governorateId!:number;

  placeId!: string;

  // rating
  ratedOnce = signal(false);
  currentUserId = signal<number | null>(null);
  alreadyRated = signal(false);
  userRating = signal<number>(0);

  placeRates = signal<PlaceRate[]>([]);

  constructor(private flowbiteService:FlowbiteService) {}

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe({
      next:((p) => {
        //console.log(p.get('placeId'));
        this.placeId = p.get('placeId')!;

        // call api
        this.placesService.getPlaceDetails(this.placeId !).subscribe({
          next:((res) => {
            console.log(res.data);
            if(res.success == true) {
              this.placeDetails = res.data;
              //console.log(res.data.governorate.id)
              this.governorateId = res.data.governorate.id;
            }
          }),
          error:((err) => {
            console.log(err)
          })
        });

        this.tryLoadMyRating();
      })
    });

    // get current user id
    this.userService.getUserInfo().subscribe({
      next:((res) => {
        this.currentUserId.set(res.data.id);

        this.tryLoadMyRating();
      }),
      error:((err) => {
        console.log(err);
      })
    });

    // get current user rating




    // flowbit
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
      });

  }


  // save
    toggleSave(ev: MouseEvent){
      ev.stopPropagation(); // ✅ عشان ميعملش navigate
      this.placeDetails.is_saved = !this.placeDetails.is_saved;

      // call api
      this.placesService.toggleSavePlace(this.placeDetails.id).subscribe({
        next:((res) => {
          console.log(res);
        }),
        error:((err) => {
          console.log(err);
        })
      })
    }

    // maps
    get mapsEmbedUrl(): SafeResourceUrl {
      const q = encodeURIComponent(this.placeDetails?.name + ', ' + this.placeDetails?.governorate?.name + ', ' + 'Egypt');
      const url = `https://www.google.com/maps?q=${q}&output=embed`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }


    // google map
    get directionsUrl() {
      // Open Google Maps directions
      const dest = `${+this.placeDetails?.location?.latitude},${+this.placeDetails?.location?.longitude}`;
      return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    }

    // back
    goBack() {
      // get keys that send in url
      this.activatedRoute.queryParamMap.subscribe({
      next:((p) => {
        //console.log(p.get('from'));
        this.from = p.get('from')!;
        //console.log(p.get('categoryId'));
        this.categoryId = p.get('categoryId')!;

        this.backRecommend = p.get('fromrecommend')!;
      })
    });

    // if come from category
    if (this.from === 'category' && this.categoryId) {
      this.router.navigate(['/category', this.categoryId]);
      return;
    }

    // if come from recommendation places
    if(this.backRecommend === 'recommend') {
      this.router.navigateByUrl('/recommendation');
    }

    // that come from home
    else {
      this.router.navigateByUrl('/home');
    }
  }


  tryLoadMyRating() {
  if (!this.placeId || !this.currentUserId()) return;
  this.loadRatings();
}



// add rating
loadRatings() {
  this.placesService.getPlaceRate(this.placeId).subscribe({
    next: (res) => {
      if (!res.success) return;

      const list: PlaceRate[] = res.data ?? [];

      this.placeRates.set(list);

      const myId = this.currentUserId();
      const mine = list.find(r => r.user?.id === myId);

      if (mine) {
        this.alreadyRated.set(true);
        this.userRating.set(Number(mine.rating));
      } else {
        this.alreadyRated.set(false);
        this.userRating.set(0);
      }
    },
    error: (err) => console.log(err),
  });
}


onRate(placeId: number, value: number) {
  if (this.alreadyRated()) return;

  this.placesService.addRatePlace(placeId, value).subscribe({
    next: (res) => {
      if (res.success) {
        this.alreadyRated.set(true);
        this.userRating.set(value);

        this.loadRatings();
      }
    },
    error: (err) => console.log(err),
  });
}




}
