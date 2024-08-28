import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-hours',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './hours.component.html',
  styleUrl: './hours.component.scss'
})
export class HoursComponent implements OnInit, OnChanges{

  basicData: any;
  basicOptions: any;
  @Input() data: any[] = [];

  ngOnInit() {
    this.initData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initData();
  }

  initData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const roomNames = this.data.map(room => room.room.name);
    const roomHours = this.data.map(room => room.totalHours);
    this.basicData = {
      labels: roomNames,
      datasets: [
        {
          label: 'Número de horas reservadas',
          data: roomHours,
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

}
