import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASE_URL = 'http://44.198.84.209:8088/api/admin/requests';
  private FILE_BASE = 'http://44.198.84.209:8088'; // Backend file host

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  /** Utility method to fix image URLs */
  private fixImage(url: string | null): string | null {
    if (!url) return null;

    // If backend already returns full URL → keep it
    if (url.startsWith('http')) return url;

    // Else backend gave partial path → prepend server base
    return this.FILE_BASE + url;
  }

  /** CREATE REQUEST */
  createRequest(data: any): Observable<any> {
    return this.http.post(this.BASE_URL, data, this.getHeaders());
  }

  /** GET ALL REQUESTS */
  getAllRequests(page = 0, size = 20): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}?page=${page}&size=${size}`, this.getHeaders())
      .pipe(
        map(res => {
          res.data.content = res.data.content.map((r: any) => ({
            ...r,
            goodsPhoto1Url: this.fixImage(r.goodsPhoto1Url),
            goodsPhoto2Url: this.fixImage(r.goodsPhoto2Url)
          }));
          return res;
        })
      );
  }

  /** GET ALL PENDING REQUESTS */
  getPendingRequests(page = 0, size = 20): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/pending?page=${page}&size=${size}`, this.getHeaders())
      .pipe(
        map(res => {
          res.data.content = res.data.content.map((r: any) => ({
            ...r,
            goodsPhoto1Url: this.fixImage(r.goodsPhoto1Url),
            goodsPhoto2Url: this.fixImage(r.goodsPhoto2Url)
          }));
          return res;
        })
      );
  }

  /** GET REQUEST BY ID */
  getRequestById(id: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/${id}`, this.getHeaders())
      .pipe(
        map(res => {
          const d = res.data;
          d.goodsPhoto1Url = this.fixImage(d.goodsPhoto1Url);
          d.goodsPhoto2Url = this.fixImage(d.goodsPhoto2Url);
          return res;
        })
      );
  }

  /** GET BY STATUS */
  getRequestsByStatus(status: string, page = 0, size = 20): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/status/${status}?page=${page}&size=${size}`, this.getHeaders())
      .pipe(
        map(res => {
          res.data.content = res.data.content.map((r: any) => ({
            ...r,
            goodsPhoto1Url: this.fixImage(r.goodsPhoto1Url),
            goodsPhoto2Url: this.fixImage(r.goodsPhoto2Url)
          }));
          return res;
        })
      );
  }

  /** APPROVE REQUEST */
  approve(requestId: string, adminId: string, adminName: string, adminPhone: string, comments: string) {
    return this.http.post(
      `${this.BASE_URL}/${requestId}/approve`,
      { adminId, adminName, adminPhone, comments },
      this.getHeaders()
    );
  }

  /** REJECT REQUEST */
  reject(requestId: string, adminName: string, adminPhone: string, reason: string) {
    return this.http.post(
      `${this.BASE_URL}/${requestId}/reject`,
      { adminName, adminPhone, reason },
      this.getHeaders()
    );
  }

  /** CANCEL REQUEST */
  cancel(requestId: string) {
    return this.http.post(`${this.BASE_URL}/${requestId}/cancel`, {}, this.getHeaders());
  }
}
