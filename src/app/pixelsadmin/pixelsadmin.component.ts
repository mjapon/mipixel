import {Component, OnInit} from '@angular/core';
import {PixelService} from '../services/pixel.service';
import {LoadingUiService} from '../services/loading-ui.service';
import {SwalService} from '../services/swal.service';
import {FautService} from '../services/faut.service';
import {Router} from '@angular/router';
import {PixelsecureService} from '../services/pixelsecure.service';

declare var $: any;

@Component({
  selector: 'app-pixelsadmin',
  templateUrl: './pixelsadmin.component.html',
  styleUrls: ['./pixelsadmin.component.css']
})
export class PixelsadminComponent implements OnInit {
  pixels = [];
  pixelinfo: any;

  constructor(private pixelSecService: PixelsecureService,
              private pixelService: PixelService,
              private swalSerice: SwalService,
              private fautService: FautService,
              private router: Router,
              private loadinUiService: LoadingUiService) {
  }

  ngOnInit(): void {
    this.verificarLogueado();
    this.pixelinfo = {};
  }

  verificarLogueado() {
    if (!this.fautService.isAuthenticated()) {
      this.router.navigate(['login']);
    } else {
      this.loadAll();
    }
  }

  loadAll() {
    this.pixelService.listarAll().subscribe(res => {
      this.pixels = res.items;
    });
  }

  confirmar(pixel) {
    const msg = prompt('Ingrese una observación', '');
    if (msg) {
      this.loadinUiService.publishBlockMessage();
      this.closemodal();
      this.pixelSecService.confirmar(pixel.px_id, msg).subscribe(res => {
        if (res.status === 200) {
          this.swalSerice.fireSuccess(res.msg);
          this.loadAll();
        }
      });
    }
  }

  anular(pixel) {
    const msg = prompt('Ingrese el motivo de la anulación', '');
    if (msg) {
      this.loadinUiService.publishBlockMessage();
      this.closemodal();
      this.pixelSecService.anular(pixel.px_id, msg).subscribe(res => {
        if (res.status === 200) {
          this.swalSerice.fireSuccess(res.msg);
          this.loadAll();
        }
      });
    }
  }

  closemodal() {
    $('#modalDetalleCompra').modal('hide');
  }

  verDetalles(item: any) {
    this.pixelinfo = {};
    this.loadinUiService.publishBlockMessage();
    this.pixelService.getInfoPixel(item.px_id).subscribe(res => {
      if (res.status === 200) {
        this.pixelinfo = res.pixel;
        $('#modalDetalleCompra').modal('show');
      } else {
        this.swalSerice.fireError(res.msg);
      }
    });
  }

  geturlimage(pixel) {
    return this.pixelService.getUrlImage(pixel);
  }

}
