import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

/*import { UserData } from '../../providers/user-data';*/
import { UserOptions } from '../../interfaces/user-options';
import {AccountService} from '../../providers/account.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public accountService: AccountService,
    public router: Router
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      /*this.userData.login(this.login.username);
      this.router.navigateByUrl('/app/tabs/map');*/
      this.accountService.login(this.login.username, this.login.password).subscribe(data => {
        console.log(data);
        debugger;
      });
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
