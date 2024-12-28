import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { SessionStorageHelperService } from '../../services/helpers/sessionStorageHelper.service';
import { SessionData } from '../../models/appModels/sessionData';
import { SessionHelperService } from '../../services/helpers/sessionHelper.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private _sessionHelperService: SessionHelperService) { }

    canActivate() {

        var myStorage: SessionStorageHelperService = new SessionStorageHelperService();
        var mySession: SessionData = myStorage.GetSessionData();

        if (mySession && mySession.userId > 0) //Para que no permita entrar al usuario Public
        {

            //TODO:Hacer autorización por route.
            return true;
        }

        this.router.navigate(['/login']);
        //this.router.navigate(['/inicio']);
        return false;
    }
}
