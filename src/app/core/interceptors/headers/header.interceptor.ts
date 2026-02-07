import { HttpInterceptorFn } from '@angular/common/http';


export const headerInterceptor: HttpInterceptorFn = (req, next) => {
 if(localStorage.getItem("userToken")) { // to sure is not null

    req = req.clone({ // get clone from requst(not updata direct in requst) and put in req paramter
      setHeaders:{
        Accept: 'application/json',
        Authorization:`Bearer ${localStorage.getItem("userToken")!}`,
        'Accept-Language': localStorage.getItem("lang") || 'en',
      }
    })
  }

  return next(req); // if(user is login (has token) , req is updata with new req config) ,
  //  if(user is not login (not has token) , req is old value (req without updata config)
};
