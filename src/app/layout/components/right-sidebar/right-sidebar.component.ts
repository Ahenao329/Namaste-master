import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../../config/app.config";
import { IAppConfig } from "../../../config/iapp.config";

@Component({
    selector: "app-right-sidebar",
    templateUrl: "./right-sidebar.component.html",
    styleUrls: ["./right-sidebar.component.scss"]    
})
export class RightSidebarComponent implements OnInit {
    @Input("box-title") title: string;
    @Input("cerrar-ventana") close: Function;
    
    public _nombreUsuario: string = "";
    public _perfilUsuario: string = "";

    isActive: boolean = false;
    showMenu: string = "";
    pushRightClass: string = "close-icon";
    _appConfig: IAppConfig = AppConfig;

    message: any;
    //subscription: Subscription;

    constructor(
        private translate: TranslateService,
        public router: Router,                      
    ) {
            
    }

    async ngOnInit() {}

    onCerrar() {
        if (this.close) {
            this.close();
        }
    }
}
