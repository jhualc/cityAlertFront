import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveAddresService {

  private saveAddresUrl = 'https://cityalertapi-dev.azurewebsites.net/alerts';

  constructor(private http: HttpClient ) { }

  saveAddress(data: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.saveAddresUrl}`, data, { headers });
  }

}
