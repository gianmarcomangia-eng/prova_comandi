import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth';
import { Timesheet } from '../models/timesheet.model';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  apiUrl = 'http://localhost:8000/timesheet';
  aggiornaTabella = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private get authToken(): string {
    return this.authService.user?.token ?? '';
  }

  getTimesheets() {
    return this.http.get<Timesheet[]>(`${this.apiUrl}?auth=${this.authToken}`);
  }

  addTimesheet(dati: Timesheet) {
    return this.http.post(`${this.apiUrl}?auth=${this.authToken}`, dati);
  }

  notificaAggiornamento(): void {
    this.aggiornaTabella.next();
  }
}
