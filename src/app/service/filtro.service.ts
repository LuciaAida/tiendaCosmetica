import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Filtro {
  tipo: string;
  subtipo?: string;
}

@Injectable({ providedIn: 'root' })
export class FiltroService {
  private filtroSubject = new BehaviorSubject<Filtro>({ tipo: '', subtipo: undefined });
  filtro$ = this.filtroSubject.asObservable();

  setFiltro(tipo: string, subtipo?: string) {
    this.filtroSubject.next({ tipo, subtipo });
  }
}
