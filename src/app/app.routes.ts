import { Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { logedGuard } from './core/guards/loged.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {path:'' , redirectTo:"home" , pathMatch:'full' , title:"Home"},

  {path:'' , component:AuthComponent,canActivate:[logedGuard],
    children:[
      {path:"signin" , loadComponent: ()=> import('./pages/sign-in/sign-in.component').then((c)=> c.SignInComponent) , title:"signin"},
      {path:"createaccount" , loadComponent: ()=> import('./pages/create-account/create-account.component').then((c)=> c.CreateAccountComponent) , title:"creatAccount"}
    ]
  },

  {path:'' , component:BlankComponent,canActivate:[authGuard],
    children:[
      {path:"home" , loadComponent: ()=> import('./pages/home/home.component').then((c)=> c.HomeComponent) ,title:"Home" },
      {path:"categories" , loadComponent: ()=> import('./pages/categories/categories.component').then((c)=> c.CategoriesComponent) ,title:"Categories"},
      {path:"recommendation" , loadComponent: ()=> import('./pages/recommendation/recommendation.component').then((c)=> c.RecommendationComponent) ,title:"Recommendation" },
      {path:"posts" , loadComponent: ()=> import('./pages/posts/posts.component').then((c)=> c.PostsComponent) ,title:"Posts" },
      {path:"saved-places" , loadComponent: ()=> import('./pages/saved-places/saved-places.component').then((c)=> c.SavedPlacesComponent) ,title:"Saved-Places" },
      {path:"profile" , loadComponent: ()=> import('./pages/profile/profile.component').then((c)=> c.ProfileComponent) ,title:"My Profile" },
      {path:"editprofile" , loadComponent: ()=> import('./pages/edit-profile/edit-profile.component').then((c)=> c.EditProfileComponent) ,title:"Edit Profile" },
      {path:"createpost" , loadComponent: ()=> import('./pages/createpost/createpost.component').then((c)=> c.CreatepostComponent) ,title:"Create Post" },
      {path:"anotherUser/:id" , loadComponent: ()=> import('./pages/another-user-profile/another-user-profile.component').then((c)=> c.AnotherUserProfileComponent) ,title:"User Profile" },
      {path:"postDetails/:id" , loadComponent: ()=> import('./pages/post-details/post-details.component').then((c)=> c.PostDetailsComponent) ,title:"Post Details" },


      {path:"category/:categoryId" , loadComponent: ()=> import('./pages/category-details/category-details.component').then((c)=> c.CategoryDetailsComponent) , title:"Category"},
      {path:"place/:placeId" , loadComponent: ()=> import('./pages/place-details/place-details.component').then((c)=> c.PlaceDetailsComponent) , title:"Details"}
    ]
  },

  {path:"**" , loadComponent: ()=> import('./pages/notfound/notfound.component').then((c)=> c.NotfoundComponent), title:"NotFound"}

];
