import { Component } from '@angular/core';
import { usuarioModelo } from '../modelo/usuario.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../service/aut-service.service';
import { user } from '@angular/fire/auth';
import { log } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 public form!: FormGroup;

 correo: string ="";
 contrasenia: string="";
 user: any = null;

  constructor(
    private autenService:AuthService,
    private formBuilder: FormBuilder
  ){
  }

  ngOnInit(): void {
    console.log("Crear cuenta inicializado");
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    })
  }


  login() {
    const {correo, contrasenia } = this.form.value;
    this.autenService.login(correo,contrasenia).then(() => {
      console.log('Login exitoso');
      // Aquí podrías redirigir al usuario o hacer cualquier acción adicional
    })
    .catch((error) => {
      console.error('Error al hacer login:', error);
      // Puedes mostrar un mensaje de error al usuario
    });
  }

  enviar(): any {
    if (this.form.valid) {
      console.log('Formulario válido');
      this.login()
    } else {
      console.log('Formulario no válido');
    }
  }
  addUsuario(){
    const usuario: usuarioModelo = {
      usuario_id: 0,
      nombre: this.form.value.nombre,
      correo: this.form.value.correo,
      contrasenia: this.form.value.contrasenia,
      confContrasenia: this.form.value.confContrasenia
    };
  }
}
