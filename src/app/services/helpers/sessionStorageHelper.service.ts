import { Injectable } from '@angular/core';
import { SessionData } from '../../models/appModels/sessionData';

@Injectable({ providedIn: 'root' })
export class SessionStorageHelperService {  

  constructor() {   }
  
  GetSessionData(): SessionData {

    var session: SessionData;
    //https://octoperf.com/blog/2016/03/29/singleton-service-using-angular2/
    
    let tempData:string = sessionStorage.getItem('sessionData');

    if (tempData)
    {
      session = JSON.parse(tempData);
    }   

    return session;
  }

  SetSessionData(session: SessionData): void {    

    let data: string = JSON.stringify(session)

    sessionStorage.setItem('sessionData', data);
  }

  RemoveSessionData(): void {
    sessionStorage.removeItem('sessionData');
  }
}