import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { ListaProductosComponent } from './components/main/producto/lista-productos/lista-productos.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/main/usuario/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, HeaderComponent, ListaProductosComponent, RouterLink, FooterComponent, LoginComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tienda-cosmetica';
}
