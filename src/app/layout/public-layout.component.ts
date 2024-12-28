import { Component, OnInit } from "@angular/core";
import { LayoutComponent } from 'app/layout/layout.component';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';

@Component({
    selector: "app-public-layout",
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class PublicLayoutComponent extends LayoutComponent implements OnInit {
    constructor(protected _sessionHelperService: SessionHelperService) {
        super(_sessionHelperService);

        this.publicMode = true;
    }
}
