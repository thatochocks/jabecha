import { Injectable } from '@angular/core';
import {InAppPurchase2 , IAPProduct} from "@ionic-native/in-app-purchase-2/ngx";
import { Platform } from '@ionic/angular';
import { CommonService } from '../services/common.service';


@Injectable({
  providedIn: 'root'
})
export class IapService {

  productIDs = ['provider_sub'];
  pid = "";
  state = true;
  constructor(
    private platform: Platform,
    private inAppPurchase: InAppPurchase2,
    private commonService: CommonService
  ) { }
  buy(product) {
    this.inAppPurchase
  .order(product).then(
    function (data) {
      console.log("succccccs"+data);
      this.commonService.showAlert('Subscription'+data);
    }
  )
  }
  setup(){
    this.platform.ready().then(() => {
      console.log("prre")
    this.productIDs.forEach(productId => {
      this.inAppPurchase.register({
        id: productId,
        type: this.inAppPurchase.PAID_SUBSCRIPTION,
        alias: productId
      });
    });
    this.inAppPurchase.refresh();
    });
    this.inAppPurchase.ready(function(){
      this.productIDs.forEach(productId => {
        this.registerHandlersForPurchase(productId);
      });

      console.log("STORE READY");
      
  });
  }
  registerHandlersForPurchase(productId) {
    let self = this.inAppPurchase;
    this.inAppPurchase.when(productId).updated(function (product) {
      if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
        product.finish();
      }
      if(product.state === self.PURCHASE_EXPIRED){
        this.commonService.showAlert('expired');
        this.state  = false;
      }
      else
      {
        this.commonService.showAlert('valid');
        this.state  = true;
      }
    });
    this.inAppPurchase.when(productId).registered((product: IAPProduct) => {
      // this.commonService.showAlert(` owned ${product.owned}`);
      console.log(` owned ${product.owned}`);
    });
    this.inAppPurchase.when(productId).owned((product: IAPProduct) => {
      // this.commonService.showAlert(` owned ${product.owned}`);
      console.log(` owned ${product.owned}`);
      // product.finish();
    });
    this.inAppPurchase.when(productId).approved((product: IAPProduct) => {
      // this.commonService.showAlert('approved');
      console.log(`approved`);
      product.finish();
    });
    this.inAppPurchase.when(productId).refunded((product: IAPProduct) => {
      // this.commonService.showAlert('refunded');
      console.log(`refunded`);
    });
    this.inAppPurchase.when(productId).expired((product: IAPProduct) => {
      // alert('expired');
      this.commonService.showAlert("Your Subscription Has Expired. Please Subscribe To Continue Using The App");
    });
}
}
