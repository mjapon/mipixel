import {Component, Inject, OnInit} from '@angular/core';
import {PixelService} from '../services/pixel.service';
import {SwalService} from '../services/swal.service';
import {DomService} from '../services/dom.service';
import {DOCUMENT} from '@angular/common';
import {LoadingUiService} from '../services/loading-ui.service';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-pixels',
  templateUrl: './pixels.component.html',
  styleUrls: ['./pixels.component.css']
})
export class PixelsComponent implements OnInit {

  clicstart = false;
  clicfinish = false;
  pixelsmatrix = [];
  xini = 0;
  yini = 0;
  bloque = 1;
  base64data: any = null;
  pixels = [];
  pixelsselected = [];
  anchocelda = 10;
  altocelda = 10;
  filas = 100;
  columnas = 100;

  eltabcuadr: any;
  form: any;
  filepreview: any;
  datafile: any;

  constructor(private pixelService: PixelService,
              private swalService: SwalService,
              private router: Router,
              private domService: DomService,
              private loadingUiService: LoadingUiService,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.eltabcuadr = document.getElementById('tablacuadricula');
    this.form = {
      email: '',
      costopx: 1,
      numpx: 0,
      costototal: 0.0,
      url: '',
      detalle: ''
    };

    this.filas = 100;
    this.columnas = 100;
    this.buildEmptyPixelsArray();
    this.loadData();
    let self = this;

    $('#modalCompra').on('shown.bs.modal', function(e) {
      $('#emailinput').focus();
    });

    $('#modalCompra').on('hide.bs.modal', function(e) {
      self.clearSelected();
      self.clearform();
    });
  }

  trackByFunctionRow(index, item) {
    return index;
  }

  trackByFunctionCol(index, item) {
    if (!item) {
      return null;
    }
    return item.px_id;
  }

  trackByImgs(index, item) {
    if (!item) {
      return null;
    }
    return item.px_id;
  }

  closemodal() {
    $('#modalCompra').modal('hide');
  }

  loadData() {
    this.loadingUiService.publishBlockMessage();
    this.pixelService.listarNoAnulados().subscribe(res => {
      if (res.status === 200) {
        this.pixels = res.items;
        this.chkStatusPixels();
      }
    });
  }

  guardaForm() {
    if (this.form.email.trim().length === 0) {
      alert('Debe ingresar el correo');
    } else if (!this.form.xini) {
      alert('Debe seleccionar los pixels que desea comprar');
    } else if (!this.base64data) {
      alert('Debe cargar la imagen');
    } else if (this.form.url.trim().length === 0) {
      alert('Debe ingresar la url de su pixel');
    } else if (this.form.detalle.trim().length === 0) {
      alert('Debe ingresar el detalle de su pixel');
    } else {
      const postform = {
        px_email: this.form.email,
        px_row: this.form.yini,
        px_col: this.form.xini,
        px_row_end: this.form.yfin,
        px_col_end: this.form.xfin,
        px_costo: this.form.costototal,
        px_url: this.form.url,
        px_numpx: this.form.numpx,
        px_texto: this.form.detalle
      };

      const msgconfirm = 'Confirma que desea realizar la compra de ' + this.form.numpx + ' pixles por un total de: $ ' + this.form.costototal;
      if (confirm(msgconfirm)) {
        this.closemodal();
        this.loadingUiService.publishBlockMessage();
        this.pixelService.upload(this.base64data, this.datafile.type, this.datafile.name, postform).subscribe(res => {
          this.clearSelected();
          this.clearform();
          if (res.status === 200) {
            this.swalService.fireSuccess(res.msg);
            this.router.navigate(['resumen', res.px_id]);
          } else {
            this.swalService.fireError(res.msg);
            if (res.status === -2) {
              this.loadData();
            }
          }
        });
      }
    }
  }

  clearSelected() {
    this.pixelsselected.forEach(pxSelIt => {
      pxSelIt.cssclass = '';
    });
    this.pixelsselected = [];
  }

  clearform() {
    this.form = {
      email: '',
      costopx: 1,
      numpx: 0,
      costototal: 0.0,
      url: ''
    };
    this.filepreview = '';
  }

  getcss(pixel) {
    const px_x = pixel.px_row < pixel.px_row_end ? pixel.px_row : pixel.px_row_end;
    const px_y = pixel.px_col < pixel.px_col_end ? pixel.px_col : pixel.px_col_end;
    const idx = 'px' + px_x + '-' + px_y;
    const elpx = document.getElementById(idx);
    if (elpx) {
      const topPx = elpx.offsetTop;
      const leftPx = elpx.offsetLeft;
      const anxhopx = this.getancho(pixel);
      const altopx = this.getalto(pixel);
      const opacidad = pixel.px_estado === 0 ? '0.4' : '1';
      const border = pixel.px_estado === 0 ? '1px solid black' : '1px solid orange';
      return {
        position: 'absolute',
        left: topPx + 'px',
        top: leftPx + 'px',
        width: anxhopx + 'px',
        height: altopx + 'px',
        border,
        opacity: opacidad
      };
    }
  }

  geturlimage(pixel) {
    return this.pixelService.getUrlImage(pixel);
  }

  getancho(pixel) {
    const px_x = pixel.px_col;
    const px_xend = pixel.px_col_end;
    const ancho = this.anchocelda;
    const numpxborde = Math.abs(px_x - px_xend) + 1;
    // var anxhopx = (numpxborde * ancho) + (numpxborde - 1);
    const anxhopx = numpxborde * ancho;
    return anxhopx;
  }

  getalto(pixel) {
    const px_x = pixel.px_row;
    const px_xend = pixel.px_row_end;
    const numpxborde = Math.abs(px_x - px_xend) + 1;
    // var altopx = (numpxborde * alto) + (numpxborde - 1);
    const altopx = numpxborde * this.altocelda;
    return altopx;
  }

  mousedown(e, px) {
    this.clicstart = true;
    this.clicfinish = false;
    this.pixelsselected = [];
    this.xini = px.x;
    this.yini = px.y;
    this.form.xini = this.xini;
    this.form.yini = this.yini;
  }

  mouseup(e, px) {
    this.clicfinish = true;
    this.clicstart = false;
    this.xini = 0;
    this.yini = 0;
    this.form.xfin = px.x;
    this.form.yfin = px.y;
    let haserror = false;
    this.pixelsmatrix.forEach(row => {
      row.forEach(pxit => {
        if (pxit.cssclass === 'marcado') {
          pxit.lock = this.bloque;
        } else if (pxit.cssclass === 'marcadoerror') {
          pxit.lock = 0;
          pxit.cssclass = '';
          haserror = true;
        }
      });
    });
    this.bloque = this.bloque + 1;
    if (!haserror) {
      if (this.form.numpx > 0) {
        $('#modalCompra').modal('show');
      }
    }
  }

  getNewPixel(x, y) {
    const pixelit = {
      id: x + ',' + y,
      x,
      y,
      status: 0,
      cssclass: '',
      lock: 0,
      comprado: 0
    };
    const ocupado = this.isPixelOcupado(pixelit);
    pixelit.comprado = ocupado ? 1 : 0;
    return pixelit;
  }

  getNewPixelEmpty(x, y) {
    const pixelit = {
      id: x + ',' + y,
      x,
      y,
      status: 0,
      cssclass: '',
      lock: 0,
      comprado: 0
    };
    return pixelit;
  }

  clearMatrix() {
    this.pixelsmatrix.forEach(row => {
      row.forEach(pxit => {
        pxit.cssclass = '';
      });
    });
  }

  calculacosto() {
    let totalfiltrados = 0;
    this.pixelsmatrix.forEach(row => {
      const arrayfiltrado = row.filter(pxit => pxit.cssclass === 'marcado');
      totalfiltrados = totalfiltrados + (arrayfiltrado ? arrayfiltrado.length : 0);
    });
    this.form.numpx = totalfiltrados;
    this.form.costototal = this.form.numpx * this.form.costopx;
  }

  onMouseOver(e, px) {
    if (this.clicstart) {
      this.getCeldasMenores(px);
      this.calculacosto();
    }
  }

  isPixelOcupado(pixel) {
    const px_x = pixel.x; // Columnas
    const px_y = pixel.y; // Filas
    let result = false;
    this.pixels.forEach(pxInfo => {
      const pxrow = pxInfo.px_row;
      const pxrow_end = pxInfo.px_row_end;
      const pxcol = pxInfo.px_col;
      const pxcol_end = pxInfo.px_col_end;
      const rowini = pxrow_end > pxrow ? pxrow : pxrow_end;
      const rowend = pxrow < pxrow_end ? pxrow_end : pxrow;
      const colini = pxcol_end > pxcol ? pxcol : pxcol_end;
      const colend = pxcol < pxcol_end ? pxcol_end : pxcol;
      if ((px_y >= rowini && px_y <= rowend) && (px_x >= colini && px_x <= colend)) {
        result = true;
      }
    });
    return result;
  }

  buildEmptyPixelsArray() {
    this.pixelsmatrix = [];
    for (let i = 1; i <= this.filas; i++) {
      const pixelr = [];
      for (let j = 1; j <= this.columnas; j++) {
        pixelr.push(this.getNewPixelEmpty(j, i));
      }
      this.pixelsmatrix.push(pixelr);
    }
  }

  getCeldasMenores(pxref) {
    const xref = pxref.x;
    const yref = pxref.y;
    let xstart = this.xini;
    let xend = xref;
    let ystart = this.yini;
    let yend = yref;
    if (xref < this.xini) {
      xstart = xref;
      xend = this.xini;
    }

    if (yref < this.yini) {
      ystart = yref;
      yend = this.yini;
    }

    this.pixelsselected = [];
    this.pixelsmatrix.forEach(row => {
      row.forEach(pxit => {
        pxit.cssclass = '';
        if ((pxit.x >= xstart && pxit.x <= xend) &&
          (pxit.y >= ystart && pxit.y <= yend)) {
          this.pixelsselected.push(pxit);
        } else {
          if (pxit.lock > 0) {
            pxit.lock = 0;
          }
        }
      });
    });

    let hascomprado = false;
    this.pixelsselected.forEach(pxSelIt => {
      pxSelIt.cssclass = 'marcado';
      if (pxSelIt.comprado === 1) {
        hascomprado = true;
      }
    });
    if (hascomprado) {
      this.pixelsselected.forEach(pxSelIt => {
        pxSelIt.cssclass = 'marcadoerror';
      });
    }
  }

  celdaClic(e, px) {

  }

  onFileChange(fileInput: any) {
    this.datafile = fileInput.target.files[0];
    if (this.datafile) {
      const length = (this.datafile.size / 1024) / 1024;
      if (length > 5) {
        this.filepreview = null;
        this.base64data = null;
        this.swalService.fireError('El tamaño de la imagen es muy grande, elija otra (Tamaño máximo 5MB)');
      } else {
        this.preview();
      }
    }
  }

  preview() {
    const mimeType = this.datafile.type;
    if (mimeType.match(/image\/*/) == null) {
      this.filepreview = null;
      this.base64data = null;
      this.swalService.fireError('Archivo incorrecto, debe cargar una imagen');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.datafile);
    reader.onload = (e) => {
      this.filepreview = reader.result;
      this.base64data = this.filepreview;
    };
  }

  private chkStatusPixels() {
    this.pixelsmatrix.forEach(row => {
      row.forEach(px => {
        const ocupado = this.isPixelOcupado(px);
        px.comprado = ocupado ? 1 : 0;
      });
    });
  }

}
