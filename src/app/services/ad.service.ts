import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAds(): Observable<any> {
    return this.http.get(this.baseUrl + `ads/ads`);
  }
}
