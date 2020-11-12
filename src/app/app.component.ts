import {Component, OnInit} from '@angular/core';
import {LoadingUiService} from './services/loading-ui.service';
import {FautService} from './services/faut.service';
import {Router} from '@angular/router';

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

  constructor(private loadingUiService: LoadingUiService,
              private fautService: FautService,
              private router: Router) {
    this.showloading = false;
  }

  ngOnInit(): void {
    this.showloading = false;
    this.loadingUiService.source.subscribe(msg => {
      if (msg === 'block') {
        this.showloading = true;
      } else if (msg === 'unblock') {
        this.showloading = false;
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
