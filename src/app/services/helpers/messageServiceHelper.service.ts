import { Injectable } from '@angular/core';
import { Observable ,  Subject, BehaviorSubject } from 'rxjs';
 
@Injectable()
export class MessageServiceHelper {
    
    private cambioAvatarSource = new BehaviorSubject<boolean>(true); // BehaviorSubject es como Subject, pero además se le envía un parámetro.
    public cambioAvatarSourceObs$ = this.cambioAvatarSource.asObservable();
    cambioAvatar(valor: boolean) {
        this.cambioAvatarSource.next(valor);
    }
}