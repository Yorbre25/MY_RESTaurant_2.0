import { Routes } from '@angular/router';
import { LoginComponent } from './components/user-access/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CreateAccountComponent } from './components/user-access/create-account/create-account.component';
import { ResetPasswordComponent } from './components/user-access/reset-password/reset-password.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: CreateAccountComponent},
    {path: 'reset-psw', component: ResetPasswordComponent},
    {path: 'home', component: HomeComponent},
    { path: '',  redirectTo: '/login', pathMatch: 'full' },
];
