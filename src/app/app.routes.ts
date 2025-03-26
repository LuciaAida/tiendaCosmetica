import { Routes } from '@angular/router';
import { ListaProductosComponent } from './components/main/producto/lista-productos/lista-productos.component';
import { LoginComponent } from './components/main/usuario/login/login.component';
import { FormContactoComponent } from './components/footer/form-contacto/form-contacto.component';
import { CestaCompraComponent } from './components/main/usuario/cesta-compra/cesta-compra.component';
import { InfoPersonalComponent } from './components/main/usuario/info-personal/info-personal.component';
import { CrearCuentaComponent } from './components/main/usuario/crearCuenta/crear-cuenta.component';
export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: 'lista', component: ListaProductosComponent },
  { path: 'crearCuenta', component: CrearCuentaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'formCont', component: FormContactoComponent },
  { path: 'cestaComp', component: CestaCompraComponent },
  { path: 'infoPers', component: InfoPersonalComponent },
  { path: '**', redirectTo: 'lista' }
];
