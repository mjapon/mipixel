import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PixelsComponent} from './pixels/pixels.component';
import {PixelsadminComponent} from './pixelsadmin/pixelsadmin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuditInterceptorService} from './services/audit-interceptor.service';
import {PixelrowComponent} from './pixelrow/pixelrow.component';
import {ResumencompraComponent} from './resumencompra/resumencompra.component';
import {LoginComponent} from './login/login.component';
import {ContactoComponent} from './contacto/contacto.component';
import {RouterModule} from '@angular/router';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {environment} from 'src/environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


const config: SocketIoConfig = {url: environment.socket, options: {}};

@NgModule({
  declarations: [
    AppComponent,
    PixelsComponent,
    PixelsadminComponent,
    PixelrowComponent,
    ResumencompraComponent,
    LoginComponent,
    ContactoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuditInterceptorService,
    multi: true
  }, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
