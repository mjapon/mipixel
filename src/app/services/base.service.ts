import {Observable, throwError} from 'rxjs';
import swal from 'sweetalert2';
import {LocalStorageService} from './local-storage.service';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';


export class BaseService {
  protected urlEndPoint: string;
  protected baseUrlEndPoint = environment.baseUrlEndPoint;

  constructor(urlPath: string, protected localStrgServ: LocalStorageService) {
    this.urlEndPoint = this.baseUrlEndPoint + urlPath;
  }

  protected buildUrlEndPoint(path: string): string {
    return this.urlEndPoint + path;
  }

  protected getHttpOptions(pparams): any {
    return {
      headers: {'Content-Type': 'application/json'},
      params: pparams
    };
  }

  protected getHttpOptionsToken(pparams): any {
    const token = this.localStrgServ.getAuthToken();
    const res = {
      headers: {
        'x-authtoken': token
      },
      params: pparams
    };

    return res;
  }

  protected fnProcesaError(e) {
    if (e) {
      if (e.status === 400) {
        // return throwError(e);
      }
      if (e.msg) {
        swal.fire('Error al procesar petición', e.msg, 'error');
      } else {
        swal.fire('Error al procesar petición', '--', 'error');
      }
    } else {
      swal.fire('Error al procesar petición', 'Error desconocido', 'error');
    }
    return throwError(e);
  }

  protected doGet(
    http: HttpClient,
    endpoint: string,
    httpOptions: any
  ): Observable<any> {
    return http.get(endpoint, httpOptions).pipe(
      map(res => {
        return res;
      }),
      catchError(this.fnProcesaError)
    );
  }

  protected doPost(
    http: HttpClient,
    endpoint: string,
    httpOptions: any,
    form: any
  ): Observable<any> {
    return http.post(endpoint, form, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }

  protected doPut(
    http: HttpClient,
    endpoint: string,
    httpOptions: any,
    form: any
  ): Observable<any> {
    return http.put(endpoint, form, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.fnProcesaError)
    );
  }
}
