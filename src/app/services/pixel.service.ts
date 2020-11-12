import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PixelService extends BaseService {

  constructor(private http: HttpClient,
              protected localStrgServ: LocalStorageService) {
    super('/api/public/uploadfile', localStrgServ);
  }

  upload(file, type, filename, formdata): Observable<any> {
    const endpoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({accion: 'updatecode'});
    return this.doPost(this.http, endpoint, httpOptions, {
      archivo: file,
      tipo: type,
      nombre: filename,
      form: formdata
    });
  }

  getUrlImage(pixel: any): string {
    return this.baseUrlEndPoint + '/pixel/getfoto?pxid=' + pixel.px_id;
  }

  listarAll(): Observable<any> {
    const endopoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({accion: 'listarall'});
    return this.doGet(this.http, endopoint, httpOptions);
  }

  listar(): Observable<any> {
    const endopoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({accion: 'listar'});
    return this.doGet(this.http, endopoint, httpOptions);
  }

  getInfoPixel(pxId: number): Observable<any> {//Editado
    const endopoint = this.urlEndPoint;
    const httpOptions = this.getHttpOptions({accion: 'getpixel', pxid: pxId});
    return this.doGet(this.http, endopoint, httpOptions);
  }

}
