import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'myNollyApp_User'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authenticated: BehaviorSubject<boolean>;
  user: any;

  constructor(private router: Router){
    Storage.get({key: TOKEN_KEY}).then(async (res: any) => {
      if(res.value){
        this.user = res.value
      }
    })
    this.authenticated = new BehaviorSubject<boolean>(false)
  }

  canActivate() {
    if (!this.authenticated.value && !this.user) {
      this.presentLoginModal();
    }
    else if(!this.authenticated.value) {
      return true
    }

    return this.authenticated;
  }

  
  async presentLoginModal(){
    this.router.navigateByUrl('signin');
  }

  setValue(newValue: any): void {
    this.authenticated.next(newValue)
  }

  getValue(): Observable<boolean> {
    return this.authenticated.asObservable();
  }
}
