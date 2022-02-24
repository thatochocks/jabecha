import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { ApisService } from 'src/app/services/apis.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { UtilService } from 'src/app/services/util.service';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { IapService } from '../services/iap.service';
import { error } from 'protractor';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  langArr = [];
  lang = 'en';
  email: string = "";
  password: string = "";
  isRegisterEnabled: any = true;
  SubscriptionState = true;
  submitted = false;
  isLogin: boolean = false;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private commonService: CommonService,
    private router: Router,
    private util: UtilService,
    private menuCtrl: MenuController,
    private api: ApisService,
    public iapService: IapService
  ) {
    this.menuCtrl.enable(false);
    this.langArr = environment.langArr;
    this.lang = this.commonService.getLang();
  }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.SubscriptionState = this.authService.getstate();
  }
  changeLang() {
    this.commonService.changeLang(this.lang);
  }
  
  login() {
    let email = (this.email).toLowerCase().trim();

    if (email.length == 0 || this.password.length == 0) {
      this.commonService.showAlert("Invalid Credentials");
    }
    else {

      this.commonService.showLoader();

      this.authService.login(email, this.password).then(authData => {

        this.commonService.hideLoader();
        localStorage.setItem('isLoggedIn', 'true');
        // this.router.navigateByUrl('/home', { skipLocationChange: true, replaceUrl: true });
      }, error => {
        this.commonService.hideLoader();
        this.commonService.showToast(error.message);
      });
      this.api.login(email, this.password).then((userData) => {
        console.log(userData);
        console.log(userData.uid);
        console.log(userData.displayName);
        console.log(userData.email);
        this.api.getProfile(userData.uid).then((info) => {
          console.log(info);
          if(info === undefined || info === null)
          {
            this.api.loginfire(userData);
          this.router.navigateByUrl('/home', { skipLocationChange: true, replaceUrl: true });
            // this.api.register(email, this.login.password, this.login.full_name).then((userData) => {
            //   console.log(userData);
            //   localStorage.setItem('uid', userData.uid);
            //   localStorage.setItem('help', userData.uid);
            //   this.isLogin = false;
            //   this.router.navigate(['/tabs']);
            // }).catch(err => {
            //     console.log(err);
            //     this.util.showToast(`${err}`, 'danger', 'bottom');
            //   }
            // }).then(el => this.isLogin = false);
          }
          else if (info && info.status === 'active') {
            localStorage.setItem('uid', userData.uid);
            localStorage.setItem('help', userData.uid);
            this.isLogin = false;
            this.util.publishLoggedIn('LoggedIn');
            // this.navCtrl.back();
            this.router.navigateByUrl('/home', { skipLocationChange: true, replaceUrl: true });

          } else {
            Swal.fire({
              title: this.util.translate('Error'),
              text: this.util.translate('Your are blocked please contact administrator'),
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: this.util.translate('Need Help?'),
              backdrop: false,
              background: 'white'
            }).then(data => {
              if (data && data.value) {
                localStorage.setItem('help', userData.uid);
                this.router.navigate(['inbox']);
              }
            });
          }
        }).catch(err => {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        });
      }).catch(err => {
        if (err) {
          console.log(err);
          this.util.showToast(`${err}`, 'danger', 'bottom');
        }
      }).then(el => this.isLogin = false);
  }
}
}
