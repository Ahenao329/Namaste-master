import { Injectable } from '@angular/core';
import { DataToPersist } from '../../models/appModels/dataToPersist.model';
import { SessionStorageHelperService } from './sessionStorageHelper.service';
//import { sessionData } from '../../models/generalModels/sessionData';

@Injectable({ providedIn: 'root' })
export class LocalStorageHelper {  

  private _userDataKey:string = "userData-template$$$999";

  public _p:string = 'Pass-VIAS19';

  constructor() {

  }
  
  getUserData(): DataToPersist {

    var userData: DataToPersist;
    //https://octoperf.com/blog/2016/03/29/singleton-service-using-angular2/
    
    
    let tempData:string =localStorage.getItem(this._userDataKey);

    if (tempData)
    {
      try {
        userData = JSON.parse(tempData);  
      } catch (error) {        
      }      
    }   
   
    return userData;
  }

  setUserData(dataToPersist: DataToPersist): void {   
    let data: string = JSON.stringify(dataToPersist)
    localStorage.setItem(this._userDataKey, data);
  }
}