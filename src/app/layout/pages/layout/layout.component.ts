import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: [MessageService]
})
export class LayoutComponent {

}
