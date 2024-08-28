import { Component, Inject, OnInit } from '@angular/core';
import { ICreateUser, IUser } from '../../../core/models/user.model';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RequestStatus } from '../../../core/models/request-status.model';
import { CustomValidators } from '../../../core/utils/validators';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';

interface InputData {
  id: number,
  user: IUser
}

interface OutputData {
  rta: boolean;
  message: string;
  user: IUser | null;
}

@Component({
  selector: 'app-user-save',
  standalone: true,
  imports: [DialogModule, FontAwesomeModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './user-save.component.html',
  styleUrl: './user-save.component.scss',
  providers: [MessageService]
})
export class UserSaveComponent implements OnInit {

  status: RequestStatus = 'init';
  faClose = faWindowClose;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  userId: number = 0;
  form!: FormGroup;
  showPassword = false;
  user: IUser | null = null;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (!data.id) {
      this.form = this.formBuilder.nonNullable.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        role: ['', [Validators.required]]
      }, {
        validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
      }
      );
    } else {
      this.userId = data.id;
      this.user = data.user;
      this.form = this.formBuilder.nonNullable.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        confirmPassword: [''],
        role: ['', [Validators.required]]
      }
      );
      this.form.patchValue({
        name: this.user.name,
        email: this.user.email,
        role: this.user.role
      })
    }
  }

  ngOnInit(): void {

  }

  onSave() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password, role } = this.form.getRawValue();
      if (!this.user) {
        const user: ICreateUser = {
          name,
          email,
          role,
          password,
          active: true,
        }
        this.userService.create(user).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Usuario creado correctamente', data.data);
            }
          },
          error: (error) => {
              this.status = 'failed';
          }
        })
      } else {
        const userUpdate = {
          name,
          email,
          role
        }
        this.userService.update(this.user.id, userUpdate).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Usuario actualizado correctamente', data.data);
            }
          },
          error: (error) => {
            this.status = 'failed';
          }
        })
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  close(rta: boolean, message: string, user: IUser | null) {
    this.dialogRef.close({ rta, message, user });
  }

}
