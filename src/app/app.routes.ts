import { Routes } from '@angular/router';
import { ListaProductosComponent } from './components/main/producto/lista-productos/lista-productos.component';

export const routes: Routes = [
    { path: 'list', component: ListaProductosComponent }, 
    { path: '', redirectTo: '/list', pathMatch: 'full' },   //redirige si no pones nada 
    { path: '**', redirectTo: '/list'}  //redirige si pones algo inventado
];
