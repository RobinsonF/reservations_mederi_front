import { Component, OnInit, signal } from '@angular/core';
import { FrequencyComponent } from '../../components/frequency/frequency.component';
import { ReportsService } from '../../../core/services/reports.service';
import { HoursComponent } from '../../components/hours/hours.component';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FrequencyComponent, HoursComponent],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {

  dataFrequency = signal<any[]>([]);
  dataHours = signal<any[]>([]);

  constructor(
    private reportService: ReportsService
  ) { }

  ngOnInit(): void {
    this.reportService.getFrequencyReport().subscribe({
      next: (data) => {
        if (data) {
          this.dataFrequency.set(data.data);
        }
      },
      error: (error) => {

      }
    })

    this.reportService.hoursReport().subscribe({
      next: (data) => {
        if (data) {
          this.dataHours.set(data.data);
        }
      },
      error: (error) => {

      }
    })
  }

}
