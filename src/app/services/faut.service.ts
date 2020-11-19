import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FautService extends BaseService {
  private bssource = new BehaviorSubject('empty');
  public source = this.bssource.asObservable();

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
    super('/api/tpxuser', localStorageService);
  }

  autenticar(username: string, password: string): Observable<any> {
    const endpoint = this.urlEndPoint;
    const form = {
      username,
      password
    };
    const httpOptions = this.getHttpOptions({accion: 'auth'});
    return this.doPost(this.http, endpoint, httpOptions, form);
  }

  isAuthenticated(): boolean {
    return this.localStorageService.getItem('fIsLogged') != null;
  }

  setAsAuthenticated(userinfo: any, token: any) {
    this.localStorageService.setItem('fIsLogged', 'true');
    this.localStorageService.setItem('infoUserFLogged', JSON.stringify(userinfo));
    this.localStorageService.setItem('auToken', token);
  }

  updateToken(token: any) {
    this.localStorageService.setItem('auToken', token);
  }

  clearInfoAuthenticated() {
    this.localStorageService.removeItem('fIsLogged');
    this.localStorageService.removeItem('infoUserFLogged');
    this.localStorageService.removeItem('auToken');
  }

  getUserInfoSaved(): any {
    const infoUser: string = this.localStorageService.getItem('infoUserFLogged');
    return JSON.parse(infoUser);
  }

  getAuToken() {
    const auToken: string = this.localStorageService.getItem('auToken');
    return auToken;
  }

  publishMessage(message: string) {
    this.bssource.next(message);
  }
}
