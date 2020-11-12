import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PixelsecureService extends BaseService {

  constructor(private http: HttpClient,
              protected localStrgServ: LocalStorageService) {
    super('/api/tpixel', localStrgServ);
  }

  anular(pxid, obs): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptionsToken({accion: 'anular'});
    return this.doPost(this.http, endpoint, httpOptions, {
      px_id: pxid,
      px_obs: obs
    });
  }

  confirmar(pxid, obs): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptionsToken({accion: 'confirmar'});
    return this.doPost(this.http, endpoint, httpOptions, {
      px_id: pxid,
      px_obs: obs
    });
  }
}
