import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApisService } from 'src/app/services/apis.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email: string = "";
  password: string = "";
  name: string = "";
  phoneNumber: string = ""
  otp: string = ""
  verificationId: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private api: ApisService,
    private commonService: CommonService,
    private translate: TranslateService,
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }
  ngOnInit() {
  }

  sendotp(){}
  verifyotp(){}


  signup() {
    if (this.email.length == 0 || this.password.length == 0 || this.name.length == 0 || this.phoneNumber.length == 0) {
      this.commonService.showToast("Invalid Credentials");
    }
    else {
      this.commonService.showLoader();
      let email = (this.email).toLowerCase().trim();
      this.authService.register(email, this.password, this.name, this.phoneNumber).then(authData => {
        this.commonService.hideLoader();
        localStorage.setItem('isLoggedIn', 'true');
        this.api.registerfire(email, this.password, this.name, authData).then((userData) => {
          console.log(userData);
          localStorage.setItem('uid', userData.uid);
          localStorage.setItem('help', userData.uid);
          this.router.navigateByUrl('/home', { skipLocationChange: true, replaceUrl: true });
        }).catch(err => {
          if (err) {
            console.log(err);
          }
        });        
      }, error => {
        this.commonService.hideLoader();
        this.commonService.showToast(error.message);
      });
    }

  }
}
