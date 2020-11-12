import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingUiService {
    private bssource = new BehaviorSubject('empty');
    public source = this.bssource.asObservable();

    constructor() {
    }

    publishMessage(message: string) {
        this.bssource.next(message);
    }

    publishBlockMessage() {
        this.bssource.next('block');
    }

    publishUnblockMessage() {
        this.bssource.next('unblock');
    }

}
