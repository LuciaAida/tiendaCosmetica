import { Routes } from '@angular/router';
import { ListaProductosComponent } from './components/main/producto/lista-productos/lista-productos.component';
import { LoginComponent } from './components/main/usuario/login/login.component';
import { CrearCuentaComponent } from './components/main/usuario/crearCuenta/crear-cuenta.component';
import { FormContactoComponent } from './components/footer/form-contacto/form-contacto.component';

export const routes: Routes = [
    { path: 'lista', component: ListaProductosComponent }, 
    { path: 'login', component: LoginComponent }, 
    { path: 'crearCuenta', component: CrearCuentaComponent }, 
    { path: 'formCont', component: FormContactoComponent }, 
    { path: '', redirectTo: '/lista', pathMatch: 'full' },   //redirige si no pones nada 
    { path: '**', redirectTo: '/lista'}  //redirige si pones algo inventado
];
