import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarModelService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllCarModels(): Observable<any> {
    return this.http.get(this.baseUrl + `ads/car-models`);
  }
}
