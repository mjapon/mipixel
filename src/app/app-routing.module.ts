import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PixelsComponent} from './pixels/pixels.component';
import {PixelsadminComponent} from './pixelsadmin/pixelsadmin.component';
import {LoginComponent} from './login/login.component';
import {ResumencompraComponent} from './resumencompra/resumencompra.component';


const routes: Routes = [
  {path: 'admin', component: PixelsadminComponent},
  {path: 'login', component: LoginComponent},
  {path: 'resumen/:px_id', component: ResumencompraComponent},
  {path: '**', component: PixelsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
