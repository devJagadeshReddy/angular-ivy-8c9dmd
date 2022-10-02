import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { WeatherService } from '../services/weather.service';
import { formatDate } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpStatus } from '../enums/HttpStatus';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss'],
})
export class TemperatureComponent implements OnInit, OnDestroy {
  inputDate: Date = new Date();
  changedDate: any;
  temperatureData: any = [];
  itemsData: any = [];
  metaData: any = [];
  columnDefs = [
    { headerName: 'Station Names', field: 'name' },
    { headerName: 'Station_Id', field: 'station_id' },
    { headerName: 'Temperature', field: 'value' },
  ];
  rowData = [];
  temperatureAPISubscription: Subscription;

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
    this.getTemperatureService();
  }

  onChangeDate(value: any) {
    this.inputDate = new Date(value);
    const format = 'YYYY-MM-ddTHH:mm:ss';
    const locale = 'en-US';
    const formattedDate = formatDate(this.inputDate, format, locale);
    this.changedDate = formattedDate;
    this.getTemperatureService();
  }

  getTemperatureService() {
    this.spinner.show();
    this.temperatureAPISubscription = this._humidityService
      .getTemperature(this.changedDate)
      .subscribe((temperatureResponse: any) => {
        if (
          temperatureResponse.code === HttpStatus.SUCCESS_200 ||
          HttpStatus.SUCCESS_201
        ) {
          this.spinner.hide();
          this.itemsData = temperatureResponse?.items[0]?.readings;
          this.metaData = temperatureResponse?.metadata?.stations;
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
    this.temperatureAPISubscription?.unsubscribe();
  }
}
