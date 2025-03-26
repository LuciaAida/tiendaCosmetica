import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-contacto',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './form-contacto.component.html',
  styleUrl: './form-contacto.component.css'
})
export class FormContactoComponent {
public form!: FormGroup;
  router: any;

  constructor(
    private formBuilder: FormBuilder,router:Router
  ){}

  enviar(): any {
    if (this.form.valid) {
      console.log('Formulario válido');
    } else {
      console.log('Formulario no válido');
    }
  }

  navigateTo(route:string){
    this.router.navigate([route]);
  }
}
