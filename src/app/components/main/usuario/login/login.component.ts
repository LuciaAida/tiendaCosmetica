import { Component } from '@angular/core';
import { usuarioModelo } from '../modelo/usuario.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../service/aut-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {
 public form!: FormGroup;
 mostrarModal: boolean = false;
 mostrarModalError: boolean = false;
 modalMensaje: string = '';
 modalMensajeError: string = '';
 correo: string ="";
 contrasenia: string="";
 user: any = null;

  constructor(
    private autenService:AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ){
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    })


    // if(this.estaAutenticado()){
    //   this.router.navigate(['/lista']);
    // }
  }


  login() {
    const {correo, contrasenia } = this.form.value;
    this.autenService.login(correo,contrasenia)
      .then(() => {
        this.modalMensaje = 'Inicio de sesión correcto';
        this.mostrarModal = true;
        this.form.reset();
    })
      .catch((error) => {
        this.modalMensajeError = 'Correo o contraseña incorrectos';
        this.mostrarModalError = true;
        this.form.reset();
    });
  }


  enviar(): any {
    //si la contraseña tiene menos que los caracteres que hemos especificado
    if (this.form.get('contrasenia')?.hasError('minlength')) {
      this.modalMensajeError = 'La contraseña debe tener al menos 6 caracteres';
      this.mostrarModalError = true;
    } else if(this.form.invalid){
      this.modalMensajeError = 'Por favor, completa todos los campos';
      this.mostrarModalError = true;
    }else{
      this.login();
    }
  }

  // estaAutenticado():boolean{
  //   return localStorage.getItem('usuario') != null; //true -> si esta activa
  // }

  navigateTo(route:string){
    this.router.navigate([route]);
  }

  cerrarModal(){
    this.mostrarModal = false;
    this.mostrarModalError = false;
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
