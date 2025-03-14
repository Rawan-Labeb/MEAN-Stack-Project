import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable ,Subject} from 'rxjs';
import { ProdReq } from '../_models/prod-request.model';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdReqService {
private apiUrl = 'http://localhost:5000/prodReq';
  private prodReqUpdated = new Subject<ProdReq>();
    constructor(private http: HttpClient) { }
  
    getAllProdReqs(): Observable<ProdReq[]> {
      return this.http.get<ProdReq[]>(`${this.apiUrl}/getAllProdReq`);
    }
    
    deleteProdReq(id: string): Observable<void> {
        console.log('Deleting ProdReq at:', `${this.apiUrl}/deleteProdReq/${id}`);
        return this.http.delete<void>(`${this.apiUrl}/deleteProdReq/${id}`).pipe(
          tap(() => console.log('Delete successful'))
        );
      }
      onProdReqUpdate(): Observable<ProdReq> {
          return this.prodReqUpdated.asObservable();
      }
}
