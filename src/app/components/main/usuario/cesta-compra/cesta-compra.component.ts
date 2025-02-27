import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-cesta-compra',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cesta-compra.component.html',
  styleUrl: './cesta-compra.component.css'
})
export class CestaCompraComponent implements OnInit{

  public form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router:Router
  ){}

  ngOnInit(): void {
      console.log("Mi cesta inicializado");
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

    navigateTo(route:string){
      this.router.navigate([route]);
    }
}
