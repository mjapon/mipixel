import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) {
  }

  public sendMessage(message) {
    this.socket.emit('new-message', message);
  }

  public getNewPixelMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('new-pixel', (message) => {
        observer.next(message);
      });
    });
  };

}
