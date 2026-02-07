import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { IcategoryHome } from '../../core/interfaces/icategory-home';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from "../../shared/pipe/search.pipe";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  imports: [NavbarComponent, CommonModule, RouterLink, FormsModule, SearchPipe , TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{

  categoriesService = inject(CategoriesService);

  allCategories:IcategoryHome[] =[];

  textInput = ''; // search query

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next:((res) => {
        // console.log(res);
        if(res.success == true) {
          console.log(res.data);
          this.allCategories = res.data;
        }
      }),
      error:((err) => {
        console.log(err);
      })
    })
  }


}
