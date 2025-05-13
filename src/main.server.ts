import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from './app/app.routes.server';
import { ProductoService } from './app/service/producto.service';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideServerRendering(),
      provideServerRouting(serverRoutes),
      // Configuración directa sin importProvidersFrom
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      ProductoService
    ]
  });
export default bootstrap;
