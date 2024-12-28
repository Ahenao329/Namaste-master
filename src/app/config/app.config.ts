import { InjectionToken, Injectable } from '@angular/core';

import { IAppConfig } from './iapp.config';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { IAppDinConfig } from './app-config.model';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: IAppConfig = {
  /**Nombres de las paginas */
  routes: {
    error404: 'error',
    accessDenied: 'access-denied',
    signup: 'Registro',
    login: 'login',
    notFound: 'not-found',
    establecerContrasena: 'establecerContrasena',
    recordarContrasena: 'recordarContrasena',

    dashboard: 'Inicio',

    dashboardPrivado: 'dashboardPrivado',

    //Admin       
    Usuarios: 'Usuarios',
    UsuariosAdmin: 'UsuariosAdmin',
    ParametrosFuncionales: 'ParametrosFuncionales',
    ParametrosFuncionalesAdmin: 'ParametrosFuncionalesAdmin',
    CambiarContra: 'CambiarContra',
    ParametrosHTML: 'ParametrosHTML',
    ParametrosHTMLAdmin: 'ParametrosHTMLAdmin',
    Cargos: 'Cargos',
    CargoAdmin: 'CargoAdmin',
    Area: 'Area',
    AreaAdmin: 'AreaAdmin',
    DiaFestivo: 'DiaFestivo',
    DiaFestivoAdmin: 'DiaFestivoAdmin',
    MaterialAdicionalCorreo: 'MaterialAdicionalCorreo',
    MaterialAdicionalCorreoAdmin: 'MaterialAdicionalCorreoAdmin',
    CategoriaHerramientaCaja: 'CategoriaHerramientaCaja',
    CategoriaHerramientaCajaAdmin: 'CategoriaHerramientaCajaAdmin',
    TipoEmocion: 'TipoEmocion',
    TipoEmocionAdmin: 'TipoEmocionAdmin',
    CategoriaHerramientaAdminPopupComponent: 'CategoriaHerramientaAdminPopup',
    CategoriaHerramientaListarPopupComponent: 'CategoriaHerramientaListarPopup',
    CajaHerramientaListarPopupComponent: 'CajaHerramientaListarPopup',
    CajaHerramientaAdminPopupComponent: 'CajaHerramientaAdminPopup',
    



    //Negocio
    RegistroDiarioEmocion: 'RegistroDiarioEmocion',
    HerramientaCaja: 'HerramientaCaja',
    HerramientaCajaAdmin: 'HerramientaCajaAdmin',
    HerramientaCajaBuscar: 'HerramientaCajaBuscar',
    BotonPanico: 'BotonPanico',
    BotonPanicoAdmin: 'BotonPanicoAdmin',

    //Informes
    ReporteDistribucion: 'ReporteDistribucion',
    ReporteHistograma: 'ReporteHistograma',

    //Public
    Inicio: 'Inicio',

    //Exportar pdf


  },

  constantes: {
    rutaImagen_cargarImagen: 'assets/images/controls/CargarImagen.png',
  }
};

@Injectable()
export class AppConfigDin {
  static settings: IAppDinConfig;
  constructor(private http: HttpClient) { }
  load() {
    const jsonFile = `assets/config/config.${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: IAppDinConfig) => {
        AppConfigDin.settings = <IAppDinConfig>response;
        resolve();
        //console.log(`Se leyó correctamente el archivo '${jsonFile}': ${JSON.stringify(response)}`);
      }).catch((response: any) => {
        //reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        console.error(`No se puede cargar el archivo '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
}


