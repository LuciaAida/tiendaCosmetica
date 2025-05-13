import { RenderMode, ServerRoute } from '@angular/ssr';
import { ProductoService } from './service/producto.service';
import { inject, Injector } from '@angular/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'detalle/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const injector = inject(Injector);
      const svc = injector.get(ProductoService);
      const ids = await svc.obtenerIds();
      return ids.map(id => ({ id }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];