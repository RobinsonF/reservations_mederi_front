import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../core/utils/validators';
import { RequestStatus } from '../../../core/models/request-status.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth.service';
import { ICreateAuthUser } from '../../../core/models/user.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, ButtonComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });
  status: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      const newUser: ICreateAuthUser = {
        name,
        email,
        password
      }
      this.authService.register(newUser).
        subscribe(
          {
            next: () => {
              this.status = 'success';
              this.router.navigate(['/login']);
            },
            error: () => {
              this.status = 'failed';

            },
          }
        );
    } else {
      this.form.markAllAsTouched();
    }
  }
}
