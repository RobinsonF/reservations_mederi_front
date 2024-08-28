import { Component, Inject, OnInit } from '@angular/core';
import { ICreateEquipment, IEquipment } from '../../../core/models/equipment.mode';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { RequestStatus } from '../../../core/models/request-status.model';
import { faEye, faEyeSlash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { EquipmentService } from '../../../core/services/equipment.service';

interface InputData {
  id: number,
  equipment: IEquipment
}

interface OutputData {
  rta: boolean;
  message: string;
  equipment: IEquipment | null;
}

@Component({
  selector: 'app-save-equipment',
  standalone: true,
  imports: [DialogModule, FontAwesomeModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './save-equipment.component.html',
  styleUrl: './save-equipment.component.scss'
})
export class SaveEquipmentComponent implements OnInit {

  status: RequestStatus = 'init';
  faClose = faWindowClose;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  equipmentId: number = 0;
  showPassword = false;
  equipment: IEquipment | null = null;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data.id) {
      this.equipmentId = data.id;
      this.equipment = data.equipment;
      this.form.patchValue({
        name: this.equipment.name,
        description: this.equipment.description,
        quantity: this.equipment.quantity.toString()
      })
    }
  }

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
  }
  );

  ngOnInit(): void {

  }

  onSave() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, description, quantity } = this.form.getRawValue();
      if (!this.equipment) {
        const equipment: ICreateEquipment = {
          name,
          description,
          quantity: parseInt(quantity, 10),
          active: true,
        }
        this.equipmentService.create(equipment).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Recurso creado correctamente', data.data);
            }
          },
          error: (error) => {
              this.status = 'failed';
          }
        })
      } else {
        const equipmentUpdate = {
          name,
          description,
          quantity: parseInt(quantity, 10),
        }
        this.equipmentService.update(this.equipment.id, equipmentUpdate).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Recurso actualizado correctamente', data.data);
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

  close(rta: boolean, message: string, equipment: IEquipment | null) {
    this.dialogRef.close({ rta, message, equipment });
  }
}
