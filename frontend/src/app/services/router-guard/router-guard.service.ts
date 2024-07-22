import { SnackbarService } from './../snackbar/snackbar.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { GlobalContants } from 'src/app/shared/global-components';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService {

  constructor(public authService: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean{
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectRole;

    const token: any = localStorage.getItem('token');
    var tokenPayload: any;
    try{
      tokenPayload = jwt_decode(token);
    }catch(err){
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let checkRole = false;
    for(let i = 0; i < expectedRoleArray.length; i++){
      if(expectedRoleArray[i] == tokenPayload.role)
        checkRole = true
    }

    if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
      if(this.authService.isAuthenticated() && checkRole){
        return true;
      }
      this.snackbarService.openSnackBar(GlobalContants.unauthorized, GlobalContants.error)
      this.router.navigate(['/cafe/dashboard']);
      return false;
    }else{
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
