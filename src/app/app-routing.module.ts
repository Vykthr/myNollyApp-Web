import { AuthGuard } from './services/auth/auth.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { Page404Component } from './pages/page404/page404.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ViewComponent } from './pages/view/view.component';
import { LoginComponent } from './pages/login/login.component';
import { AccountComponent } from './pages/account/account.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: LoginComponent },
  { path: 'movie/:id', component: ViewComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/:id', component: CategoriesComponent },
  { path: 'categories/:id/:id', component: CategoriesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'admin', component: AdminComponent },
  { path: 'page-404', component: Page404Component },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
