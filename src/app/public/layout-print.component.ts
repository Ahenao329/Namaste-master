import { Component, OnInit } from '@angular/core';
import { SessionHelperService } from 'app/services/helpers/sessionHelper.service';

@Component({
    selector: 'app-layout-print',
    templateUrl: './layout-print.component.html',
    styleUrls: ['./layout-print.component.scss']
})
export class LayoutPrintComponent implements OnInit {
   

    constructor(protected _sessionHelperService: SessionHelperService) {
       
    }

    async ngOnInit() {

       
    }
  
}
