import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserOptions } from '../../interfaces/user-options';
import {AccountService} from '../../providers/account.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit{
  login: UserOptions = { username: '', password: '' };
  submitted = false;
  error: string;

  constructor(
    public accountService: AccountService,
    public router: Router
  ) { }

  ngOnInit() {
    if (this.accountService.isLoggedIn()) {
      this.router.navigateByUrl('/app/tabs/map');
      return;
    }
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.accountService.login(this.login.username, this.login.password).subscribe(data => {
        this.router.navigateByUrl('/app/tabs/map');
      }, error => {
        this.error = 'Username or password incorrect';
      });
    }

  }

  onSignup() {
    this.router.navigateByUrl('/signup');

  }

}
