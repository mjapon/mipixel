import {Component, OnInit} from '@angular/core';
import {FautService} from '../services/faut.service';
import {SwalService} from '../services/swal.service';
import {Router} from '@angular/router';
import {LocalStorageService} from '../services/local-storage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UiService} from '../services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submited: boolean;

  constructor(private fb: FormBuilder,
              private fautService: FautService,
              private swalService: SwalService,
              private router: Router,
              private uiService: UiService,
              private localStorageService: LocalStorageService) {
  }

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.createForm();
    this.verificarLogueado();
  }

  createForm() {
    const codFocus = 'usernameInput';
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.uiService.setFocusById(codFocus, 1500);
  }


  verificarLogueado() {
    if (this.fautService.isAuthenticated()) {
      this.router.navigate(['admin']);
    }
  }

  onclickSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const form = this.loginForm.value;
    this.fautService.autenticar(form.username, form.password).subscribe(
      res => {
        if (res.autenticado) {
          this.fautService.setAsAuthenticated(res.userinfo, res.token);
          this.fautService.publishMessage('login');
          //this.swalService.fireToastSuccess('', 'Bienvenido: ' + res.userinfo.per_nombres);
          this.router.navigate(['admin']);
        } else {
          this.swalService.fireWarning('Usuario o clave incorrectos');
        }
      }
    );
  }

}
