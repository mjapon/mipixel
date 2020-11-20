import {Component, OnInit} from '@angular/core';
import {LoadingUiService} from './services/loading-ui.service';
import {FautService} from './services/faut.service';
import {Router} from '@angular/router';
import {ChatService} from './services/chat.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mipixelng';
  showloading: boolean;
  islogged: boolean;
  userlogged: any;
  usuariosEnLinea: number;
  nuevasCompras: Array<any>;

  constructor(private loadingUiService: LoadingUiService,
              private fautService: FautService,
              private router: Router,
              private chatService: ChatService,
              private messageService: MessageService) {
    this.showloading = false;
  }

  ngOnInit(): void {
    this.showloading = false;
    this.nuevasCompras = [];
    this.usuariosEnLinea = 0;
    this.loadingUiService.source.subscribe(msg => {
      if (msg === 'block') {
        setTimeout(() => {
            this.showloading = true;
          },
          10
        );
      } else if (msg === 'unblock') {
        setTimeout(() => {
            this.showloading = false;
          },
          100
        );
      } else if (msg === 'clearmsgsocket') {
        this.nuevasCompras = [];
      }
    });
    this.verificarLogueado();

    this.fautService.source.subscribe(msg => {
      if (msg === 'logout') {
        this.islogged = false;
      } else if (msg === 'login') {
        this.islogged = true;
        this.userlogged = this.fautService.getUserInfoSaved();
      }
    });

    this.chatService.getNewPixelMessage().subscribe((message: any) => {
      if (message) {
        if (message.tipo === 0) {
          this.usuariosEnLinea++;
        } else if (message.tipo === 1) {
          if (this.usuariosEnLinea > 0) {
            this.usuariosEnLinea--;
          }
        } else if (message.tipo === 2) {
          this.nuevasCompras.push(message.msg);
          if (this.islogged) {
            this.messageService.add({severity: 'success', summary: 'Nueva compra', detail: message.msg});
          }
        }
      }
    });

  }

  verificarLogueado() {
    this.islogged = false;
    if (this.fautService.isAuthenticated()) {
      this.islogged = true;
    }
    if (this.islogged) {
      this.userlogged = this.fautService.getUserInfoSaved();
    }
  }

  logout() {
    this.fautService.clearInfoAuthenticated();
    this.verificarLogueado();
    this.router.navigate(['login']);
  }


  login() {
    this.router.navigate(['login']);
  }
}
