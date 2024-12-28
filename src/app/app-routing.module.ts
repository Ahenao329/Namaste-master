import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { BlockUIModule } from 'ng-block-ui';
import { AppConfig } from './config/app.config';

import { ServerErrorComponent } from './server-error/server-error.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { EstablecerContrasenaComponent } from './login/establecer/establecerContrasena.component';
import { RecordarContrasenaComponent } from './login/recordar/recordarContrasena.component';
import { PublicRoutingModule } from './public/public-routing.module';

const routes: Routes = [

    //La entrade del routing es por el módulo PublicRoutingModule
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
    
    { path: AppConfig.routes.login, component: LoginComponent },
    { path: AppConfig.routes.establecerContrasena + '/:id', component: EstablecerContrasenaComponent },
    { path: AppConfig.routes.recordarContrasena, component: RecordarContrasenaComponent },
    //{ path: AppConfig.routes.registro, component: RegistroProfesorComponent },

    { path: AppConfig.routes.error404, component: ServerErrorComponent },
    { path: AppConfig.routes.accessDenied, component: AccessDeniedComponent },
    { path: AppConfig.routes.notFound, component: NotFoundComponent },
    { path: '**', redirectTo: AppConfig.routes.notFound },
];

@NgModule({
    imports: [PublicRoutingModule, RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
