import { Component, OnInit, HostListener, OnDestroy, ViewChild, ContentChild } from '@angular/core';
import { usuarioLoginService } from './services/generalService/usuarioLogin.service';
import { Subscription } from 'rxjs';
import { MessageServiceHelper } from './services/helpers/messageServiceHelper.service';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    //message: any;
    //subscription: Subscription;
   

    constructor(private messageService: MessageServiceHelper) {
        // subscribe to home component messages
        /*this.subscription = this.messageService.getMessage().subscribe(message => { 
            this.message = message; 
            if (this.side)
            {
                var temp='';
            }
        });*/
    }
 
    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        //this.subscription.unsubscribe();
    }

   
}
