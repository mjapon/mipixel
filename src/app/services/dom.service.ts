import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DomService {
    constructor() {
    }

    /**
     * Setea el foco en el input especificado dado su id
     * @param elId: Identificador del componente al que desea obtene el foco
     */
    setFocus(elId) {
        if (document.getElementById(elId)) {
            document.getElementById(elId).focus();
        }
    }

    setFocusTimeout(elId, timeout) {
        setTimeout(() => {
                if (document.getElementById(elId)) {
                    document.getElementById(elId).focus();
                }
            }
            , timeout);
    }


}
