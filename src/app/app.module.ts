import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PixelsComponent} from './pixels/pixels.component';
import {PixelsadminComponent} from './pixelsadmin/pixelsadmin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuditInterceptorService} from './services/audit-interceptor.service';
import { PixelrowComponent } from './pixelrow/pixelrow.component';
import { ResumencompraComponent } from './resumencompra/resumencompra.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    PixelsComponent,
    PixelsadminComponent,
    PixelrowComponent,
    ResumencompraComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuditInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
