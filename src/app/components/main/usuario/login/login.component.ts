import { Component } from '@angular/core';
import { usuarioModelo } from '../modelo/usuario.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    console.log("Crear cuenta inicializado");
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  enviar(): any {
    if (this.form.valid) {
      console.log('Formulario válido');
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
