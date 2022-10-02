import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const _getHumididtyURL: string =
  'https://api.data.gov.sg/v1/environment/relative-humidity?date_time=';
const _getTemperatureURL: string =
  'https://api.data.gov.sg/v1/environment/air-temperature?date_time=';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getHumidity(inputDate: any): Observable<any> {
    return this.http.get<any>(_getHumididtyURL + `${inputDate}`);
  }

  getTemperature(inputDate: any): Observable<any> {
    return this.http.get<any>(_getTemperatureURL + `${inputDate}`);
  }
}
