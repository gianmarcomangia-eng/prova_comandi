import { Component } from '@angular/core';
import { TimesheetForm } from '../timesheet-form/timesheet-form';
import { TimesheetListComponent } from '../timesheet-list/timesheet-list';


@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [TimesheetForm, TimesheetListComponent],
  templateUrl: './timesheet.html',
  styleUrl: './timesheet.css'
})
export class TimesheetComponent {}