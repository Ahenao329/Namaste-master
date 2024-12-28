import { Component, OnInit } from '@angular/core';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';
import { EnumPerfiles } from 'app/shared/enums/commonEnums';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    public rightOptions: boolean[];
    public publicMode: boolean;

    public _mostrarSideBar: boolean = false;

    constructor(protected _sessionHelperService: SessionHelperService) {
        this.resetOptions();

        this.publicMode = false;
    }

    async ngOnInit() {

        let indice: number = 0;

        //Esperar a que haya sesión, si se hizo en background, o 3 segundos
        while (indice < 10 && !this._sessionHelperService.existeSesion()) {
            await this.delay(500);
            indice++;
        }

        let temp = this._sessionHelperService.getSessionUser();

        if (!this.publicMode && (this._sessionHelperService.getSessionUser().idPerfil != EnumPerfiles.Publico)) {
            this._mostrarSideBar = true;
        }
    }

    resetOptions() {
        this.rightOptions = [false];
    }

    onUserProfile = () => {
        this.resetOptions();
        this.rightOptions[0] = true;
    };

    onCerrar = () => {
        this.resetOptions();
    };

    public isHideSideBar: boolean = false;
    onToggleSideBar = (value: boolean) => {
        this.isHideSideBar = !value;
    };

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
