import {Injectable} from '@angular/core';
import swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SwalService {
  constructor() {
  }

  showMsg(msg: string, type: any, title: string = 'Mensaje') {
    swal.fire(title, msg, type);
  }

  fireInfo(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'info', title);
  }

  fireSuccess(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'success', title);
  }

  fireWarning(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'warning', title);
  }

  fireError(msg: string, title: string = 'Mensaje') {
    this.showMsg(msg, 'error', title);
  }

  fireDialog(msg: string, ptitle: string = '¿Esta segur@?') {
    return swal.fire({
      title: ptitle,
      text: msg,
      showConfirmButton: true,
      showCancelButton: true
    });
  }
}
