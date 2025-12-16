import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecordsService {

    constructor(private http: HttpClient) { }

    getGlobalRecords(): Observable<any[]> {
        return this.http.get<any[]>(
            `${environment.apiBaseUrl}/records`
        );
    }

    getUserRecords(username: string): Observable<any[]> {
        return this.http.get<any[]>(
            `${environment.localApiBaseUrl}/records/${username}`
        );
    }
}
