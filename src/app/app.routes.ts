import { Routes } from '@angular/router';
import { MoviesComponent } from './components/movies/movies.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuardService } from './services/auth/auth.guard.service';
import { DescriptionComponent } from './components/movies/description/description.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'movies',
        pathMatch: 'full'
    },
    {
        path: 'movies',
        component: MoviesComponent,
    },
    {
        path: 'movies/:id',
        component: DescriptionComponent
    },
    {
        path: 'auth',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: UserComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '**',
        redirectTo: 'movies',
        pathMatch: 'full',
    },
];
