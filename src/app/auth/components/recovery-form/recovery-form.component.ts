import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomValidators } from '../../../core/utils/validators';
import { RequestStatus } from '../../../core/models/request-status.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recovery-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, FontAwesomeModule],
  templateUrl: './recovery-form.component.html',
  styleUrl: './recovery-form.component.scss'
})
export class RecoveryFormComponent {

  form = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private router: Router
    ) {
      this.activateRoute.queryParamMap.subscribe(params => {
        const token = params.get('token');
        if(token){
          this.token = token;
        }else{
          this.router.navigate(['/login']);
        }
      });
    }

  recovery() {
    if (this.form.valid) {
      const {newPassword} = this.form.getRawValue();
      this.status = 'loading';
      this.authService.changePassword(this.token,newPassword).subscribe(
        {
          next: () => {
            this.status = 'success';
            this.router.navigate(['/login']);
          },
          error: () => {
            this.status = 'failed';
          }
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
}
