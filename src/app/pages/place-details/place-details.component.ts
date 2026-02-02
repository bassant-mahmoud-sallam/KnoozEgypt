import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { PlacesService } from '../../core/services/places/places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IplaceDetails } from '../../core/interfaces/iplace-details';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';

import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-place-details',
  imports: [NavbarComponent, StarRatingComponent],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent  implements OnInit{

  private readonly placesService = inject(PlacesService);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly sanitizer = inject(DomSanitizer);

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  placeDetails!:IplaceDetails;

  from!:string;
  categoryId!:string;
  backRecommend!:string;

  constructor(private flowbiteService:FlowbiteService) {}

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe({
      next:((p) => {
        //console.log(p.get('placeId'));
        let placeId = p.get('placeId');

        // call api
        this.placesService.getPlaceDetails(placeId !).subscribe({
          next:((res) => {
            console.log(res.data);
            if(res.success == true) {
              this.placeDetails = res.data;
              console.log(this.placeDetails)
            }
          }),
          error:((err) => {
            console.log(err)
          })
        })
      })
    });

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



}
