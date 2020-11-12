import {Injectable} from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() {
  }

  setFocusById(elId: string, timeout?: number) {
    if (timeout) {
      setTimeout(() => {
        $('#' + elId).focus();
      }, 100);
    } else {
      $('#' + elId).focus();
    }
  }

  setFocusByClass(cssclass: string, timeout?: number) {
    if (timeout) {
      setTimeout(() => {
        $('.' + cssclass).focus();
      }, 100);
    } else {
      $('.' + cssclass).focus();
    }
  }

}
