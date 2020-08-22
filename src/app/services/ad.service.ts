import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  private baseUrl = environment.baseUrl;
  ad_detailsAdId = new Subject<string>();

  constructor(private http: HttpClient) { }

  getAds(): Observable<any> {
    return this.http.get(this.baseUrl + `ads/ads`);
  }

  postAd(body): Observable<any> {
    return this.http.post(this.baseUrl + `ads/ads`, body);
  }
}
