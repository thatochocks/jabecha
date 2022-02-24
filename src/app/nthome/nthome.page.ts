import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'; 
import { PickerController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { TripService } from '../services/trip.service';


@Component({
  selector: 'app-nthome',
  templateUrl: './nthome.page.html',
  styleUrls: ['./nthome.page.scss'],
})
export class NthomePage implements OnInit {

  public myForm: FormGroup;
  priceOffer: any = 0;
  price: any = 0;
  items: any = [];
  private playerCount: number = 1;
  defaultColumnOptions = [
    
  ]

  multiColumnOptions = [
    [
      'Minified',
      'Responsive',
      'Full Stack',
      'Mobile First',
      'Serverless'
    ],
    [
      'Tomato',
      'Avocado',
      'Onion',
      'Potato',
      'Artichoke'
    ]
  ]

    constructor(
      private formBuilder: FormBuilder, 
      private pickerController: PickerController,
      private router: Router, 
      private common: CommonService,
      private tripService: TripService,
    ){

    this.myForm = formBuilder.group({
      player1: ['', Validators.required]
    });

  }
  done()
  {
    this.playerCount = 0;
   Object.keys(this.myForm.controls).forEach(key => {
     if(this.myForm.get(key).value != '')
    {
      this.items[this.playerCount] = this.myForm.get(key).value;
     this.playerCount++;
    }
    });
    console.log(this.items);
    if (this.playerCount <1)
    {
      this.common.showAlert("Please Provide The Items To Pickup");
    }
    else if (this.priceOffer<10)
    {
      this.common.showAlert("Please Provide A Valid Offer");
    }
    else{
      this.tripService.setNthome(this.items, this.price, this.priceOffer);
      this.common.showToast("Nthome Added");
      this.router.navigateByUrl('/home');
    }
  }
  back(){
    this.router.navigateByUrl('/home');
  }
  openPicker(numColumns = 1, numOptions = this.defaultColumnOptions[0].length, columnOptions = this.defaultColumnOptions){
    let picker =  this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(value["col-0"].text);
            this.price = parseInt(value["col-0"].text);
          }
        }
      ]
    }).then(res => res.present());
  }
  openPickerOffer(numColumns = 1, numOptions = this.defaultColumnOptions[0].length, columnOptions = this.defaultColumnOptions){
    let picker =  this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(value["col-0"].text);
            this.priceOffer = parseInt(value["col-0"].text);
          }
        }
      ]
    }).then(res => res.present());
  }

getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }

    return options;
  }
  addControl(){
    this.playerCount++;
    this.myForm.addControl('player' + this.playerCount, new FormControl('', Validators.required));
  }
  removeControl(control){
    this.myForm.removeControl(control.key);
  }
  ngOnInit() {
    console.log("START");
    var list = [];
    for (var i = 0; i <= 5000; i=i+10) {
        list.push(i);
    }
    this.defaultColumnOptions.push(list);
  }
}
