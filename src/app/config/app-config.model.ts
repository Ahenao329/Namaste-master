export interface IAppDinConfig {
    env: {
        name: string;
    };   
    apiServer: {
        urlAPI: string; 
        urlSite:string;       

        mostrarBanner:string;
        urlBannerRedirect:string;   
        
        rutaApp:string;   
        VersionApp:string;   
        FechaVersionApp:string;                   
    };

}