import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-frequency',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './frequency.component.html',
  styleUrl: './frequency.component.scss'
})
export class FrequencyComponent implements OnChanges {

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
    const roomNames = this.data.map(room => room.name);
    const roomReservations = this.data.map(room => room.reservationCount);
    this.basicData = {
      labels: roomNames,
      datasets: [
        {
          label: 'Número de reservaciones',
          data: roomReservations,
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
