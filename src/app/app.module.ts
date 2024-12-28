import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_CONFIG, AppConfig, AppConfigDin } from './config/app.config';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from './shared/modules/shared.module';

import { ServerErrorComponent } from './server-error/server-error.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { usuarioLoginService } from './services/generalService/usuarioLogin.service';
import { SessionHelperService } from './services/helpers/sessionHelper.service';
import { LocalStorageHelper } from './services/helpers/localStorageHelper.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { SeparadoresNumeroPipe} from './shared/pipes/shared-pipes.module';
import { EstablecerContrasenaComponent } from './login/establecer/establecerContrasena.component';
import { RecordarContrasenaComponent } from './login/recordar/recordarContrasena.component';
import { MessageServiceHelper } from './services/helpers/messageServiceHelper.service';
import { APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function initializeApp(appConfigDin: AppConfigDin) {
    return () => appConfigDin.load();
  }

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        BlockUIModule.forRoot({
            message: 'Cargando...',
            delayStart: 0,
            delayStop: 300
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        SharedModule.forRoot(),
        AppRoutingModule,
        RouterModule, 
        FormsModule,
        ReactiveFormsModule,
        NgbModule,        

    ],
    declarations: [
        AppComponent,
        ServerErrorComponent,
        AccessDeniedComponent,
        NotFoundComponent,
        LoginComponent,        
        SeparadoresNumeroPipe,
        EstablecerContrasenaComponent,
        RecordarContrasenaComponent
        
        
    ],
    providers: [
        AppConfigDin,
        { provide: APP_INITIALIZER,//Inicializar desde el archivo editable de configuración
            useFactory: initializeApp,
            deps: [AppConfigDin], multi: true },
        AuthGuard,        
        { provide: APP_CONFIG, useValue: AppConfig },
        usuarioLoginService,
        SessionHelperService,
        LocalStorageHelper,
        MessageServiceHelper,
        
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor() {
        registerLocaleData(localeEs);
    }
}
