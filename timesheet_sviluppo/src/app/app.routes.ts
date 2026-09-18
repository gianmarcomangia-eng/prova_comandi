import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';
import { TimesheetComponent } from './components/timesheet/timesheet';
import { Signup } from './components/signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: Signup },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'timesheet', pathMatch: 'full' },
      { path: 'timesheet', component: TimesheetComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
