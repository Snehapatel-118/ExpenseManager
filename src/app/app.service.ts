import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { appUrls } from './app-urls'
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar,) {
  }

  getDateFormat(date): string {
    const datePipe = new DatePipe('en-GB');
    return datePipe.transform(date, 'yyyy/MM/dd');
  }

  async loadDropdowns(reqParams: any): Promise<any> {
    const httpUrl = appUrls.masterUrl + appUrls.loadDropdowns
    return await this.http
      .post<any[]>(httpUrl, reqParams, httpOptions)
      .toPromise();
  }

  async loadExpenses(reqParams: any): Promise<any> {
    const httpUrl = appUrls.masterUrl + appUrls.loadExpenses
    return await this.http
      .post<any[]>(httpUrl, reqParams, httpOptions)
      .toPromise();
  }

  async loadExpenseDetailsTypeWise(reqParams: any): Promise<any> {
    const httpUrl = appUrls.masterUrl + appUrls.loadExpenseDetailsTypeWise
    return await this.http
      .post<any[]>(httpUrl, reqParams, httpOptions)
      .toPromise();
  }

  async createExpense(reqParams: any): Promise<any> {
    const httpUrl = appUrls.masterUrl + appUrls.createExpense
    return await this.http
      .post<any[]>(httpUrl, reqParams, httpOptions)
      .toPromise();
  }

  async getExpenseById(reqParams: any): Promise<any> {
    const httpUrl = appUrls.masterUrl + appUrls.getExpenseById
    return await this.http
      .post<any[]>(httpUrl, reqParams, httpOptions)
      .toPromise();
  }

  async editExpense(reqParams: any): Promise<any> {
    const httpUrl = appUrls.masterUrl + appUrls.editExpense
    return await this.http
      .post<any[]>(httpUrl, reqParams, httpOptions)
      .toPromise();
  }

  public displaySnackBar(isSuccessful: boolean, message: string) {
    this.snackBar.open(message, 'close', {
      duration: 3000,
      panelClass: isSuccessful ? ['alert-success'] : ['alert-danger'],
      verticalPosition: 'top',
    });
  }
  public displaySnackBar2(
    isSuccessful: boolean,
    message: string,
    duration: number
  ) {
    this.snackBar.open(message, 'close', {
      duration: duration,
      panelClass: isSuccessful ? ['alert-success'] : ['alert-danger'],
      verticalPosition: 'top',
    });
  }
}
