import {Component, OnInit} from '@angular/core';
import {PixelService} from '../services/pixel.service';
import {LoadingUiService} from '../services/loading-ui.service';
import {SwalService} from '../services/swal.service';
import {FautService} from '../services/faut.service';
import {Router} from '@angular/router';
import {PixelsecureService} from '../services/pixelsecure.service';
import {ChatService} from '../services/chat.service';
import {SocketMessage} from '../socketmessage';

declare var $: any;

@Component({
  selector: 'app-pixelsadmin',
  templateUrl: './pixelsadmin.component.html',
  styleUrls: ['./pixelsadmin.component.css']
})
export class PixelsadminComponent implements OnInit {
  pixels = [];
  totalconf: number;
  pixelinfo: any;
  usuariosEnLinea: number;
  nuevasCompras: Array<any>;

  constructor(private pixelSecService: PixelsecureService,
              private pixelService: PixelService,
              private swalSerice: SwalService,
              private fautService: FautService,
              private router: Router,
              private loadinUiService: LoadingUiService,
              private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.verificarLogueado();
    this.pixelinfo = {};
    this.totalconf = 0;
    this.nuevasCompras = [];
    this.usuariosEnLinea = 0;

    this.chatService.getNewPixelMessage().subscribe((message: SocketMessage) => {
      if (message) {
        if (message.tipo === 0) {
          this.usuariosEnLinea++;
        } else if (message.tipo === 1) {
          if (this.usuariosEnLinea > 0) {
            this.usuariosEnLinea--;
          }
        } else if (message.tipo === 2) {
          this.nuevasCompras.push(message.msg);
        }
      }
    });

    this.loadinUiService.publishClearAdmin();
  }

  verificarLogueado() {
    if (!this.fautService.isAuthenticated()) {
      this.router.navigate(['login']);
    } else {
      this.loadAll();
    }
  }

  realoadCompras() {
    this.loadinUiService.publishClearAdmin();
    this.loadAll();
  }

  loadAll() {
    this.nuevasCompras = [];
    this.loadinUiService.publishBlockMessage();
    this.pixelService.listarAll().subscribe(res => {
      this.pixels = res.items;
      this.totalconf = res.totalconf;
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
