import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateUser } from './pages/create-user/create-user';
import { ListUsers } from './pages/list-users/list-users';
import { EditUser } from './pages/edit-user/edit-user';
import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'create-user', component: CreateUser, canActivate: [AuthGuard] },
  { path: 'list-users', component: ListUsers, canActivate: [AuthGuard] },
  { path: 'edit-user/:id', component: EditUser, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // redireciona inicial para login
  { path: '**', redirectTo: 'login' } // qualquer rota desconhecida
];
