import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authenticated: BehaviorSubject<boolean>;
  profileType = 'user'

  constructor(private router: Router){
    this.authenticated = new BehaviorSubject<boolean>(false)
  }

  canActivate() {
    if (!this.authenticated.value) {
      this.presentLoginModal();
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
