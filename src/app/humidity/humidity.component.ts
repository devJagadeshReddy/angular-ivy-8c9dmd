import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherService } from '../services/weather.service';
import { formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpStatus } from '../enums/HttpStatus';

@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.component.html',
  styleUrls: ['./humidity.component.css'],
})
export class HumidityComponent implements OnInit, OnDestroy {
  inputDate: Date = new Date();
  changedDate: any;
  humidityData: any = [];
  itemsData: any = [];
  metaData: any = [];
  columnDefs = [
    { headerName: 'Station Names', field: 'name' },
    { headerName: 'Station_Id', field: 'station_id' },
    { headerName: 'Humidity', field: 'value' },
  ];
  rowData = [];
  humidityAPISubscription: Subscription;

  constructor(
    private _humidityService: WeatherService,
    private spinner: NgxSpinnerService
  ) {
    this.changedDate = formatDate(
      this.inputDate,
      'YYYY-MM-ddTHH:mm:ss',
      'en-US'
    );
  }

  ngOnInit(): void {
    this.getHumidityService();
  }

  onChangeDate(value: any) {
    this.inputDate = new Date(value);
    const format = 'YYYY-MM-ddTHH:mm:ss';
    const locale = 'en-US';
    const formattedDate = formatDate(this.inputDate, format, locale);
    this.changedDate = formattedDate;
    this.getHumidityService();
  }

  getHumidityService() {
    this.spinner.show();
    this.humidityAPISubscription = this._humidityService
      .getHumidity(this.changedDate)
      .subscribe((humidityResponse: any) => {
        if (
          humidityResponse.code === HttpStatus.SUCCESS_200 ||
          HttpStatus.SUCCESS_201
        ) {
          this.spinner.hide();
          this.itemsData = humidityResponse?.items[0]?.readings;
          this.metaData = humidityResponse?.metadata?.stations;
          let allData = this.itemsData?.map((item: any) => {
            let matchingId = this.metaData?.find(
              (meta: any) => item.station_id === meta.device_id
            );
            if (matchingId) Object.assign(item, matchingId);
            return item;
          });
          this.rowData = allData;
        } else {
        }
      });
  }

  ngOnDestroy() {
    this.humidityAPISubscription?.unsubscribe();
  }
}
