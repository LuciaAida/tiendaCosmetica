import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { usuarioModelo } from '../modelo/usuario.model';
import { AuthService } from '../../../../service/aut-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.css'
})
export class CrearCuentaComponent implements OnInit {
  registroUsu = {
    correo: '',
    contrasenia: ''
  }
  mostrarContrasenia: boolean = false;
  mostrarContraseniaConfirmacion: boolean = false;
  mostrarModal: boolean = false;
  mostrarModalError: boolean = false;
  modalMensaje: string = '';
  modalMensajeError: string = '';
  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      confContrasenia: ['', [Validators.required, Validators.minLength(6)]],
      esAdmin: false
    }, {
      validators: this.contraseniasNoCoinciden
    });
  }


  registro() {
    const { correo, contrasenia, nombre } = this.form.value;
    this.auService.register(correo, contrasenia, nombre).then(() => {
      this.modalMensaje = 'Registro correcto';
      this.mostrarModal = true;
      this.form.reset();
    })
      .catch((error) => {
        this.modalMensajeError = 'Registro incorrecto';
        this.mostrarModalError = true;
        this.form.reset();
      });
  }

  enviar(): any {
    if (this.form.get('contrasenia')?.hasError('minlength')) {
      this.modalMensajeError = 'La contraseña debe tener al menos 6 caracteres';
    } else if (this.form.get('confContrasenia')?.hasError('minlength')) {
      this.modalMensajeError = 'La confirmación de contraseña debe tener al menos 6 caracteres';
    } else if (this.form.get('correo')?.hasError('required')) {
      this.modalMensajeError = 'Por favor, ingrese su correo electrónico';
    } else if (this.form.get('correo')?.hasError('email')) {
      this.modalMensajeError = 'Correo electrónico no válido';
    } else if (this.form.hasError('contraseniasNoCoinciden')) {
      this.modalMensajeError = 'Las contraseñas no coinciden';
    } else {
      this.modalMensajeError = 'Por favor, completa todos los campos';
    }

    if (this.form.invalid) {
      this.mostrarModalError = true;
    } else {
      this.registro();
    }
  }

  contraseniasNoCoinciden(FormGroup: FormGroup): ValidationErrors | null {
    const contrasenia = FormGroup.get('contrasenia')?.value;
    const confContrasenia = FormGroup.get('confContrasenia')?.value;
    if (contrasenia != confContrasenia) {
      return { contraseniasNoCoinciden: true };
    }
    return null; //si coinciden, no hay error
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mostrarModalError = false;
  }


  addUsuario() {
    const usuario: usuarioModelo = {
      usuario_id: 0,
      nombre: this.form.value.nombre,
      correo: this.form.value.correo,
      contrasenia: this.form.value.contrasenia,
      confContrasenia: this.form.value.confContrasenia,
      esAdmin: false
    };

  }
}