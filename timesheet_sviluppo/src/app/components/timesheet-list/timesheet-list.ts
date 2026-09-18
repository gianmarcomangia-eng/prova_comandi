import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { TimesheetService } from '../../services/timesheet';
import { Timesheet } from '../../models/timesheet.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";

@Component({
  selector: 'app-timesheet-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTabsModule, 
    MatFormFieldModule, 
    MatLabel
  ],
  templateUrl: './timesheet-list.html',
  styleUrl: './timesheet-list.css',
})
export class TimesheetListComponent implements OnInit, OnDestroy {

  listaTimesheet: Timesheet[] = [];
  colonneTabella = ['date', 'project_name', 'hours', 'notes'];
  private sub?: Subscription;
  mostraForm: boolean = false;

  meseCorrente: number = new Date().getMonth(); 
  annoCorrente: number = new Date().getFullYear(); 
  nomeMeseCorrente: string = ''; 
  
  giorniDelMese: number[] = [];
  colonneMostrate: string[] = [];
  datiPivot: any[] = []; 

  constructor(private tsService: TimesheetService) {}

  ngOnInit(): void {
    this.aggiornaCalendario(); 
    
    if (this.tsService['authService']?.isAuthenticated()) {
      this.caricaTimesheet();
    }

    this.sub = this.tsService.aggiornaTabella.subscribe(() => {
      if (this.tsService['authService']?.isAuthenticated()) {
        this.caricaTimesheet();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleForm() {
    this.mostraForm = !this.mostraForm;
  }

  cambiaMese(direzione: number) {
    this.meseCorrente += direzione;
    if (this.meseCorrente < 0) {
      this.meseCorrente = 11;
      this.annoCorrente--;
    } else if (this.meseCorrente > 11) {
      this.meseCorrente = 0;
      this.annoCorrente++;
    }
    
    this.aggiornaCalendario();
    this.trasformaDatiInPivot(this.listaTimesheet); 
  }

  aggiornaCalendario() {
    
    const giorniNelMese = new Date(this.annoCorrente, this.meseCorrente + 1, 0).getDate();
    
    this.giorniDelMese = Array.from({length: giorniNelMese}, (_, i) => i + 1);
    this.colonneMostrate = ['progetto', ...this.giorniDelMese.map(g => g.toString()), 'totale'];

    const nomiMesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    this.nomeMeseCorrente = `${nomiMesi[this.meseCorrente]} ${this.annoCorrente}`;
  }

  getNomeGiorno(giorno: number): string {
    const data = new Date(this.annoCorrente, this.meseCorrente, giorno); 
    const giorniSettimana = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
    return giorniSettimana[data.getDay()];
  }

  
  caricaTimesheet(): void {
    if (!this.tsService['authService']?.isAuthenticated()) {
      this.listaTimesheet = [];
      this.datiPivot = [];
      return;
    }

    this.tsService.getTimesheets().subscribe({
      next: (data) => {
        this.listaTimesheet = data;
        this.trasformaDatiInPivot(data);
      },
      error: (err) => console.error(err),
    });
  }

  trasformaDatiInPivot(datiGrezzi: Timesheet[]) {
    const mappaProgetti = new Map<string, any>();

   
    const datiDelMese = datiGrezzi.filter(record => {
      const partiData = record.date.split('-');
      const annoRecord = parseInt(partiData[0], 10);
      const meseRecord = parseInt(partiData[1], 10) - 1; 
      
      return annoRecord === this.annoCorrente && meseRecord === this.meseCorrente;
    });

    datiDelMese.forEach(record => {
      const partiData = record.date.split('-'); 
      const giorno = parseInt(partiData[2], 10); 
      const nomeProgetto = record.project_name;

      if (!mappaProgetti.has(nomeProgetto)) {
        mappaProgetti.set(nomeProgetto, { progetto: nomeProgetto, totale: 0 });
      }

      const rigaProgetto = mappaProgetti.get(nomeProgetto);
      rigaProgetto[giorno] = (rigaProgetto[giorno] || 0) + record.hours;
      rigaProgetto.totale += record.hours;
    });

    this.datiPivot = Array.from(mappaProgetti.values());
  }

}