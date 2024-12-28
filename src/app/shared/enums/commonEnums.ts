export enum EnumHTTPErrors {
    //https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
    NODISPONIBLE = 0, //Servicio no disponible, rechazo inmediato
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    REQUEST_TIMEOUT = 408,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503
}


export enum EnumRecursos {
    SinEspecificar = 0,
    Usuario = 1,

    login = 9,

    ParametroFuncional = 13,
    ParametroHTML = 15,

    Area = 30,
    Cargo = 31,
    DiaFestivo = 32,
    MaterialAdicionalCorreo = 33,
    CategoriaHerramientaCaja = 34,


    MaestrasNoAdministrables = 48,

    Desktop = 50,



    //Negocio
    RegistroDiarioEmocion = 100,
    HerramientaCaja = 101,
    BotonPanico  = 102,

    //Negocio no modelo


    //Informes
    ReporteDistribucion = 300,
    ReporteHistograma = 301,


    //Recursos solo de cliente

    //Público
    Inicio = 900,
}

export enum EnumParametros {
    SinEspecificar = 0,
    RegistrosPorPagina = 1,


    RegistrosPorPaginaMax = 5000,


    //config
    ExtensionesArchivosCaja,
    TamanoMaximoArchivos,
}



export enum EnumParametrosHTML {
    SinEspecificar = 0,



}

export enum EnumSiNo {
    SinEspecificar = 0,
    Si = 1,
    No = 2
}

export enum EnumPerfiles {
    SinEspecificar = 0,
    Administrador = 1,
    AdministradorEmpresa = 2,
    LiderEquipo = 3,
    ResponsableSaludEmocional = 4,
    Usuario = 5,
    Consulta = 6,
    Publico = 10,
}

export enum EnumTipoConfirm {
    Informacion = 1,
    Confirmacion = 2
}



//Específicas [Aplicación X]

export enum EnumTipoHerramientaCaja {
    SinEspecificar = 0,
    Link = 1,
    Documento = 2
}


