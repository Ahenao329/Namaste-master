import { Injectable } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { editorDefaultConfig } from 'app/shared/common/commonAngularEditor';

@Injectable({ providedIn: 'root' })
export class FunctionsHelperService {

  constructor() { }



  //Es solo para strings con separador decimal, no de miles. 
  //Devuelve el número, o NaN si no lo puede convertir.
  toDecimal(valor: string): number {
    let retorno: number = NaN;

    if (valor.trim().length > 0) {//Para evitar que convierta cadena vacía a cero

      //Hallar el separador decimal del cliente
      let floatTemp: string = (3 / 2).toString();
      let sep: string = floatTemp.substring(1, 2);

      let temp: string = valor.replace(/\./g, sep).replace(/\,/g, sep);

      retorno = Number(temp);
    }

    return retorno;
  }

  //Configuración por defecto para el Editor HTML
  getEditorDefaultConfig(minHeight: string = ''): AngularEditorConfig {
    var retorno: AngularEditorConfig = editorDefaultConfig;

    retorno.editable = true;//Por alguna razón mantiene el estado así se recargue la página

    if (minHeight != '')
      retorno.minHeight = minHeight;

    return retorno;
  }

  showFileFromBlob(blob: Blob, fileName: string, contentType: string) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = new Blob([blob], { type: contentType });

    // IE/Edge doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, fileName);
      return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement("a");
    link.href = data;
    link.download = fileName;
    link.click();
    setTimeout(function () {
      window.URL.revokeObjectURL(data); // For Firefox it is necessary to delay revoking the ObjectURL
    }, 200);

  }

  getContentTypeArchivo(extension: string): string {
    let retorno = "";

    extension = extension.toLowerCase();

    switch (extension) {
      case "xlsx":
        retorno =
          "application/vnd.ms-excel";
        break;
      case "docx":
        retorno =
          "application/msword";
        break;
      case "pptx":
        retorno = "	application/vnd.ms-powerpoint";
        break;
      case "pdf":
        retorno = "application/pdf";
        break;
      case "jpg":
        retorno = "image/jpeg";
        break;
      case "zip":
        retorno = "application/zip"//"application/zip, application/octet-stream";
        break;
      default:
        retorno = "application/octet-stream";
        break;
    }

    return retorno;
  }

  //Parametrización de opciones del calendar
  /*getRangeFromNUntilNow(param:number,retorno:INgxMyDpOptions){     
      let myDateUntil: Date = new Date();
      myDateUntil.setDate(myDateUntil.getDate() - param);
      
      retorno.disableUntil = { year: myDateUntil.getFullYear(), month: myDateUntil.getMonth() + 1, day: myDateUntil.getDate() };
  }

  getDisabledUntilNow(retorno:INgxMyDpOptions){   
    let myDateUntil: Date = new Date();
    myDateUntil.setDate(myDateUntil.getDate() - 1);

    retorno.disableUntil = { year: myDateUntil.getFullYear(), month: myDateUntil.getMonth() + 1, day: myDateUntil.getDate() };
}*/




  //Específico Sistema gestión



}