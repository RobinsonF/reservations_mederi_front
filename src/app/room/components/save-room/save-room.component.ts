import { Dialog, DIALOG_DATA, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RequestStatus } from '../../../core/models/request-status.model';
import { ICreateRoom, IFindOneRomm, IRoom } from '../../../core/models/room.model';
import { faEye, faEyeSlash, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { RoomService } from '../../../core/services/room.service';
import { EquipmentService } from '../../../core/services/equipment.service';
import { IEquipment } from '../../../core/models/equipment.mode';
import { catchError, finalize, forkJoin, map, of, switchMap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { RoomEquipmentService } from '../../../core/services/room-equipment.service';
import { ICreateRoomEquipment } from '../../../core/models/room-equipment.model';
import { DeleteComponent } from '../../../shared/components/delete/delete.component';

interface InputData {
  id: number,
  room: IRoom | null,
}

interface OutputData {
  rta: boolean;
  message: string;
  room: IRoom | null;
}

@Component({
  selector: 'app-save-room',
  standalone: true,
  imports: [DialogModule, FontAwesomeModule, ReactiveFormsModule, ButtonComponent, NgFor, NgIf],
  templateUrl: './save-room.component.html',
  styleUrl: './save-room.component.scss'
})
export class SaveRoomComponent {

  status: RequestStatus = 'init';
  faClose = faWindowClose;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  roomId: number = 0;
  showPassword = false;
  room: IRoom | null = null;
  roomOne = signal<IFindOneRomm | null>(null);
  listEquipment = signal<IEquipment[]>([]);

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private dialog: Dialog,
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private equipmentService: EquipmentService,
    private roomEquipmentService: RoomEquipmentService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data.id) {
      this.roomId = data.id;
      this.room = data.room;
    }
  }

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    location: ['', [Validators.required]],
    capacity: ['', [Validators.required]],
    equipment: this.formBuilder.array([])
  }
  );

  ngOnInit(): void {
    this.equipmentService.get().pipe(
      switchMap((data) => {
        if (data) {
          this.listEquipment.set(data.data);
          if (this.room) {
            return this.roomService.getById(this.roomId);
          }
        }
        return of(null);
      }),
      catchError((error) => {
        console.error('Error en la consulta:', error);
        return of(null);
      }),
      finalize(() => {

      })
    ).subscribe((roomData) => {
      if (roomData) {
        this.roomOne.set(roomData.data);
        this.form.patchValue({
          name: this.roomOne()?.name,
          location: this.roomOne()?.location,
          capacity: this.roomOne()?.capacity.toString()
        });
        this.roomOne()?.equipment.map(item => {
          this.addEquipmentFromUpdate(item.RoomEquipment.id, item.id, item.quantity);
        });
      }
    });
  }

  get equipment(): FormArray {
    return this.form.get('equipment') as FormArray;
  }

  addEquipmentFromUpdate(id: number, equipmentId: number, quantity: number) {
    const equipmentForm = this.formBuilder.group({
      id: [id.toString()],
      equipmentId: [equipmentId.toString(), [Validators.required]],
      quantity: [quantity.toString(), [Validators.required]]
    });

    this.equipment.push(equipmentForm);
  }

  addEquipment() {
    const equipmentForm = this.formBuilder.group({
      id: [''],
      equipmentId: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    });

    this.equipment.push(equipmentForm);
  }

  removeEquipment(index: number) {
    if (this.room) {
      const id = parseInt(this.equipment.controls[index].get('id')?.value, 10) || 0;
      if (id !== 0) {
        this.dialog.open<any>(DeleteComponent, {
          data: {
            title: '¿Está seguro que desea eliminar este recurso?'
          }
        }).closed.subscribe(data => {
          if (data.rta) {
            this.roomEquipmentService.delete(id).subscribe({
              next: (data) => {
                if (data) {
                  if (this.equipment && this.equipment.length > index) {
                    this.equipment.removeAt(index);
                  }
                }
              },
              error: (error) => {
              }
            })
          }
        })
      } else {
        if (this.equipment && this.equipment.length > index) {
          this.equipment.removeAt(index);
        }
      }
    } else {
      if (this.equipment && this.equipment.length > index) {
        this.equipment.removeAt(index);
      }
    }
  }

  getSelectedEquipmentIds(): string[] {
    return this.equipment.controls
      .map(group => group.get('equipmentId')?.value)
      .filter(id => id);
  }

  isEquipmentDisabled(equipmentId: number): boolean {
    return this.getSelectedEquipmentIds().includes(equipmentId.toString());
  }

  onSave() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, location, capacity } = this.form.getRawValue();
      const equipment = (this.equipment.controls as FormGroup[]).map((control: FormGroup) => ({
        id: control.get('id')?.value,
        equipmentId: control.get('equipmentId')?.value,
        quantity: control.get('quantity')?.value
      }));
      if (!this.room) {
        const room: ICreateRoom = {
          name,
          location,
          capacity: parseInt(capacity, 10),
          active: true,
        }
        this.roomService.create(room).pipe(
          switchMap((data: any) => {
            if (data) {
              const roomId = data.data.id;
              const equipmentRequests = equipment.map(item => {
                const roomEquipment: ICreateRoomEquipment = {
                  roomId: roomId,
                  equipmentId: item.equipmentId,
                  quantity: item.quantity,
                  active: true
                };

                return this.roomEquipmentService.create(roomEquipment).pipe(
                  catchError((error) => {
                    console.error('Error al crear equipo', error);
                    return of(null);
                  })
                );
              });
              return forkJoin(equipmentRequests).pipe(
                map(() => data)
              );
            } else {
              throw new Error('Error al crear la sala');
            }
          }),
          catchError((error) => {
            this.status = 'failed';
            console.error('Error al crear la sala y equipos', error);
            return of(null);
          })
        ).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Sala creada correctamente', data.data);
            }
          },
          error: (error) => {
            console.error('Error en el proceso de creación', error);
          }
        });
      } else {
        const roomUpdate = {
          name,
          location,
          capacity: parseInt(capacity, 10),
        }
        this.roomService.update(this.room.id, roomUpdate).pipe(
          switchMap((data) => {
            if (data) {
              const equipmentRequests = equipment.map(item => {
                if (item.id === '') {
                  const roomEquipment: ICreateRoomEquipment = {
                    roomId: this.roomId,
                    equipmentId: item.equipmentId,
                    quantity: item.quantity,
                    active: true
                  };

                  return this.roomEquipmentService.create(roomEquipment).pipe(
                    catchError((error) => {
                      console.error('Error al crear equipo', error);
                      return of(null);
                    })
                  );
                } else {
                  const roomEquipmentUpdate = {
                    quantity: item.quantity,
                    equipmentId: item.equipmentId,
                  };
                  return this.roomEquipmentService.update(item.id, roomEquipmentUpdate).pipe(
                    catchError((error) => {
                      console.error('Error al actualizar equipo', error);
                      return of(null);
                    })
                  );
                }
              });

              return forkJoin(equipmentRequests).pipe(
                switchMap(() => of(data))
              );
            } else {
              throw new Error('Error al actualizar la sala');
            }
          }),
          catchError((error) => {
            this.status = 'failed';
            console.error('Error en la actualización de la sala', error);
            return of(null);
          })
        ).subscribe({
          next: (data) => {
            if (data) {
              this.close(true, 'Sala actualizada correctamente', data.data);
            }
          },
          error: (error) => {
            console.error('Error en el proceso de actualización', error);
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  close(rta: boolean, message: string, room: IRoom | null) {
    this.dialogRef.close({ rta, message, room });
  }

}
