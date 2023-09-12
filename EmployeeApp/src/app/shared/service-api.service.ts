import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmployeeDetail } from './model-api.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { TypeofExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  list: EmployeeDetail[] = [];
  url: string = environment.apiBaseUrl + '/EmployeeDetail';
  constructor(private _http: HttpClient) {}

  private employeeDataSubject = new BehaviorSubject<EmployeeDetail[]>([]);
  public employeeData$ = this.employeeDataSubject.asObservable();

  private statusSource = new BehaviorSubject<string>(''); // Initial value is an empty string
  currentStatus$: Observable<string> = this.statusSource.asObservable();

  updateEmployeeData(data: EmployeeDetail[]) {
    this.employeeDataSubject.next(data);
  }

  updateStatus(newStatus: string) {
    this.statusSource.next(newStatus);
  }

  getEmployee(): Observable<EmployeeDetail[]> {
    return this._http.get<EmployeeDetail[]>(this.url);
  }
  addEmployee(data: EmployeeDetail): Observable<EmployeeDetail[]> {
    return this._http.post<EmployeeDetail[]>(this.url, data);
  }
  deleteEmployee(id: number): Observable<EmployeeDetail[]> {
    return this._http.delete<EmployeeDetail[]>(this.url + `/${id}`);
  }
  updateEmployee(
    id: number,
    data: EmployeeDetail
  ): Observable<EmployeeDetail[]> {
    console.log('This is the ID  type in the request :' + typeof id);

    return this._http.put<EmployeeDetail[]>(this.url + `/${id}`, data);
  }
}
