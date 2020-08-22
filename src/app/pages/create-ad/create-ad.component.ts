import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { AdService } from 'src/app/services/ad.service';
import { CarModelService } from '../../services/car-model.service';
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  isLimitedDistance = true;     // limitedDistance
  availableKilometers?: string;    //Basic usage1
  kilometersTraveled?: string;    //Basic usage2
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  value = '';         // number of seats
  title = 'Input a number of child seats';

  inputCarModel?: string;
  filteredCarModelOptions: string[] = [];
  carModelOptions = [];

  fuelTypeRadio = 'Benzine';
  gearshifTypeRadio = 'Automatic';
  numberOfGears = 4;

  defaultFileList: UploadFile[] = [];

  fileList2 = [...this.defaultFileList];

  constructor(private carModelService: CarModelService,
              private message: NzMessageService,
              private store: Store<fromApp.AppState>,
              private adService: AdService) {
   }

  ngOnInit(): void {
    this.setupCarModelList();

    let userRole: string;
    this.store.select("auth").subscribe(authData => {
        userRole = authData.user.userRole;
    });
  }

  handleData = [];

  setupCarModelList(): void {
    this.carModelService.getAllCarModels().subscribe(data => {
      data.forEach(element => {
        this.carModelOptions.push(element.brandName + ", " + element.modelName);
      });
      this.filteredCarModelOptions = this.carModelOptions;
    }, error => {
      console.log(error.error.message);
    });
  }

  onChangeCarModel(value: string): void {
    this.filteredCarModelOptions = this.carModelOptions.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  onChange(value: string): void {
    this.updateValue(value);
  }

  onBlur(): void {
    if (this.value.charAt(this.value.length - 1) === '.' || this.value === '-') {
      this.updateValue(this.value.slice(0, -1));
    }
  }

  updateValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === '' || value === '-') {
      this.value = value;
    }
    this.inputElement!.nativeElement.value = this.value;
    this.updateTitle();
  }

  updateTitle(): void {
    this.title = (this.value !== '-' ? this.formatNumber(this.value) : '-') || 'Input a number';
  }

  formatNumber(value: string): string {
    const stringValue = `${value}`;
    const list = stringValue.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

  createAd(): void {
    if( !this.availableKilometers || !this.kilometersTraveled || !this.value || !this.inputCarModel) {
        this.message.warning("Input fields is required");
        return;
    }

    let agentId;
    this.store.select("auth").subscribe(authData => {
        agentId = authData.user.id;
    });

    // image & user
    var formData = new FormData();
    this.fileList2.forEach(element => {
      formData.append('imageFile', element.originFileObj, element.originFileObj.name);
    });
    formData.append('request', new Blob([JSON.stringify({
      'carModel': this.inputCarModel,
      'gearshiftType': this.gearshifTypeRadio,
      'numberOfGears': this.numberOfGears,
      'fuelType': this.fuelTypeRadio,
      'agentId': agentId,
      'limitedDistance': this.isLimitedDistance,
      'availableKilometersPerRent': this.availableKilometers,
      'kilometersTraveled': this.kilometersTraveled,
      'seats': this.value,
    })], {
        type: "application/json"
    }));

    this.adService.postAd(formData).subscribe(() => {
      this.message.info('Successfully created!');
    }, error => {
        console.log(error.error.message);
        this.message.info('Something was wrong.');
    });
  }

}
