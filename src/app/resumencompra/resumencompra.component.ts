import {Component, OnInit} from '@angular/core';
import {PixelService} from '../services/pixel.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingUiService} from '../services/loading-ui.service';

@Component({
  selector: 'app-resumencompra',
  templateUrl: './resumencompra.component.html',
  styleUrls: ['./resumencompra.component.css']
})
export class ResumencompraComponent implements OnInit {
  pixelinfo: any;
  pxId: number;

  constructor(private pxService: PixelService,
              private route: ActivatedRoute,
              private loadingUiService: LoadingUiService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.pixelinfo = {};
    this.route.paramMap.subscribe(params => {
      this.pxId = parseInt(params.get('px_id'), 10);
      this.loadDatosPixel();
    });
  }

  loadDatosPixel(): void {
    this.loadingUiService.publishBlockMessage();
    this.pxService.getInfoPixel(this.pxId).subscribe(res => {
      if (res.status === 200) {
        this.pixelinfo = res.pixel;
      }
    });
  }

  cerrar() {
    this.loadingUiService.publishBlockMessage();
    this.router.navigate(['*']);
  }
}
