import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { usuarioModelo } from '../modelo/usuario.model';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.css'
})
export class CrearCuentaComponent implements OnInit{
  modalMensaje: string = '';
  modalMensajeError: string = '';
  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    console.log("Crear cuenta inicializado");
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      confContrasenia: ['', [Validators.required]]
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
  
    // this.AnimalServiceService.addAnimal(animal).subscribe(
    //   (response) => {
    //     this.modalMensaje = `Animal ${animal.nombre} añadido con éxito`;
    //     this.mostrarModal = true;
    //     this.form.reset();
    //   },
    //   (error) => {
    //     console.error('Error al añadir el animal', error);
    //     this.modalMensaje = 'Hubo un error al añadir el animal.';
    //     this.mostrarModal = true;
    //   }
    // );
  }
}