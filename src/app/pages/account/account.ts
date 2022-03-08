import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {AccountService} from '../../providers/account.service';
import {User} from '../../model/user';
import {LoginData} from '../../model/auth/login-data';
import { snapshot } from '../../shared/utils/snapshot.util';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit {
  password: string;
  email: string;
  user: User;
  login: LoginData;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    this.user = this.accountService.userValue;
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Password',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.accountService.update(this.user.id, {password: data.password});
            this.getEmail();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'password',
          value: this.password,
          placeholder: 'password'
        }
      ]
    });
    await alert.present();
  }

  getEmail() {
    this.email = this.accountService.userValue?.email;

  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.accountService.logout();
  }

  support() {
    this.router.navigateByUrl('/support');
  }
}
