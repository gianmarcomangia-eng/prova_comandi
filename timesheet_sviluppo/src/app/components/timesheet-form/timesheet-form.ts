import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TimesheetService } from '../../services/timesheet';
import { Timesheet } from '../../models/timesheet.model';

@Component({
  selector: 'app-timesheet-form',
  standalone: true,
  imports: [FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatNativeDateModule, MatDatepickerModule],
  templateUrl: './timesheet-form.html',
  styleUrl: './timesheet-form.css',
})
export class TimesheetForm {

  oggi = new Date(); 

  nuovoTimesheet = {
    date: this.oggi, 
    hours: null,
    project_name: '',
    notes: ''
  };
  constructor(private timesheetService: TimesheetService) {}

  onSubmit(form: NgForm): void {

    const ore = Number(form.value.hours);
    if (ore > 8){
      alert('Non puoi inserire più di 8 ore al giorno.');
      return;
    }
    const dati: Timesheet = {
      date: form.value.date,
      project_name: form.value.project_name,
      hours: form.value.hours,
      notes: form.value.notes || '',
    };

    this.timesheetService.addTimesheet(dati).subscribe({
      next: () => {
        form.reset();
        this.timesheetService.notificaAggiornamento();
      },
      error: (err) => console.error(err),
    });
  }
}
