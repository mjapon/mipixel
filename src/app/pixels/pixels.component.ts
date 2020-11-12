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
  anchocelda = 0;
  anchoceldamin = 9;
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
    this.setupanchoalto();
    this.buildEmptyPixelsArray();
    this.loadData();
    var self = this;

    $('#modalCompra').on('shown.bs.modal', function(e) {
      $('#emailinput').focus();
    });

    $('#modalCompra').on('hide.bs.modal', function(e) {
      self.clearSelected();
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
    this.pixelService.listar().subscribe(res => {
      if (res.status === 200) {
        this.pixels = res.items;
        this.chkStatusPixels();
      }
    });
  }

  setupanchoalto(): void {
    const eltabcuadr = document.getElementById('contenedorpixel');
    const width = eltabcuadr.offsetWidth;
    const celdawidth = width / this.columnas;
    const anchoceldacalc = Math.trunc(celdawidth);
    this.anchocelda = anchoceldacalc >= this.anchoceldamin ? anchoceldacalc : this.anchoceldamin;
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
        px_row: this.form.xini,
        px_col: this.form.yini,
        px_row_end: this.form.xfin,
        px_col_end: this.form.yfin,
        px_costo: this.form.costototal,
        px_url: this.form.url,
        px_numpx: this.form.numpx,
        px_texto: this.form.detalle
      };

      this.closemodal();
      this.loadingUiService.publishBlockMessage();
      this.pixelService.upload(this.base64data, this.datafile.type, this.datafile.name, postform).subscribe(res => {
        this.clearSelected();
        this.clearform();
        if (res.status === 200) {
          this.swalService.fireSuccess(res.msg);
          this.router.navigate(['resumen', res.px_id]);
        }
      });
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
      const top = this.eltabcuadr.offsetTop + elpx.offsetTop;
      const left = this.eltabcuadr.offsetLeft + elpx.offsetLeft;
      const anxhopx = this.getancho(pixel);
      const altopx = this.getalto(pixel);
      return {
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        width: anxhopx + 'px',
        height: altopx + 'px',
        border: '1px solid orange'
      };
    }
  }

  geturlimage(pixel) {
    return this.pixelService.getUrlImage(pixel);
  }

  getancho(pixel) {
    const px_x = pixel.px_row;
    const px_xend = pixel.px_row_end;
    const ancho = this.anchocelda;
    const numpxborde = Math.abs(px_x - px_xend) + 1;
    // var anxhopx = (numpxborde * ancho) + (numpxborde - 1);
    const anxhopx = numpxborde * ancho;
    return anxhopx;
  }

  getalto(pixel) {
    const px_x = pixel.px_col;
    const px_xend = pixel.px_col_end;
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
      $('#modalCompra').modal('show');
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
      if ((px_y >= colini && px_y <= colend) && (px_x >= rowini && px_x <= rowend)) {
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

  buildPixelsArray() {
    this.pixelsmatrix = [];
    for (let i = 1; i <= this.filas; i++) {
      const pixelr = [];
      for (let j = 1; j <= this.columnas; j++) {
        pixelr.push(this.getNewPixel(j, i));
      }
      this.pixelsmatrix.push(pixelr);
    }
  }

  gethtmltable() {
    let htmltable = '<table class="cuadricula" id="tablacuadricula">';
    this.pixelsmatrix.forEach(e => {
      htmltable += '<tr>' + this.gethtmlrow(e) + '</tr>';
    });
    htmltable += '</table>';
    return htmltable;
  }

  gethtmlrow(fila) {
    let colshtml = '';
    fila.forEach(px => {
      const id = 'px' + px.x + '-' + px.y;
      colshtml += '<td class="hand" ng-mouseover="cntrl.onMouseOver($event,px)"' +
        '            ng-class="px.cssclass" ng-mousedown="cntrl.mousedown($event, px)" ng-mouseup="cntrl.mouseup($event, px)"' +
        '            id="' + id + '" width="' + this.anchocelda + 'px" height="' + this.altocelda + 'px">\n' +
        '                </td>';
    });
    return colshtml;
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
    this.preview();
  }

  preview() {
    const mimeType = this.datafile.type;
    if (mimeType.match(/image\/*/) == null) {
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
