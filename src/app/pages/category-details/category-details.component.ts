import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Iplace } from '../../core/interfaces/iplace';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { StarRatingComponent } from "../../shared/star-rating/star-rating.component";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from "../../shared/pipe/search.pipe";
import { PlacesService } from '../../core/services/places/places.service';

@Component({
  selector: 'app-category-details',
  imports: [NavbarComponent, StarRatingComponent, RouterLink, FormsModule, SearchPipe],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent implements OnInit{

  private readonly activatedRoutect = inject(ActivatedRoute);
  private readonly CategoriesService = inject(CategoriesService);
  private readonly placesService = inject(PlacesService)

  categoryPlaces:Iplace[] =[];
  categoryName:string = '';
  categoryId:string='';

  textInput:string = '';

  ngOnInit(): void {
    this.activatedRoutect.paramMap.subscribe({
      next:((p) => {
        //console.log(p.get('categoryId'));
        this.categoryId = p.get('categoryId')!;

        // call api
        this.CategoriesService.getPlacesbyCategory(this.categoryId !).subscribe({
          next:((res) => {
            //console.log(res.data.places);
            this.categoryPlaces = res.data.places;
            //console.log(res.data.category.name);
            this.categoryName = res.data.category.name;
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
    ev.stopPropagation(); // ✅ عشان ميعملش navigate
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
