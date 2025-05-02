import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private admin: boolean = false;
  private testPielSubject = new BehaviorSubject<string | null>(null);
  private testPeloSubject = new BehaviorSubject<string | null>(null);

  testPiel$ = this.testPielSubject.asObservable();
  testPelo$ = this.testPeloSubject.asObservable();
  
  private cestaSubject = new BehaviorSubject<any[]>([]);
  cesta$ = this.cestaSubject.asObservable();

  constructor(private firestore: Firestore) { }

  setAdmin(value: boolean) {
    this.admin = value;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  cargarDatosUsuario(usuario_id: string) {
    const ref = doc(this.firestore, `usuarios/${usuario_id}`);
    docData(ref).subscribe(data => {
      // Tests
      this.testPeloSubject.next(data?.['testPelo'] ?? null);
      this.testPielSubject.next(data?.['testPiel'] ?? null);
      // Cesta
      this.cestaSubject.next(data?.['cesta'] ?? []);
    });
  }

  async guardarTestPelo(usuario_id: string, resultado: string) {
    const ref = doc(this.firestore, `usuarios/${usuario_id}`);
    await setDoc(ref, { testPelo: resultado }, { merge: true });
    this.testPeloSubject.next(resultado);
  }

  async guardarTestPiel(usuario_id: string, resultado: string) {
    const ref = doc(this.firestore, `usuarios/${usuario_id}`);
    await setDoc(ref, { testPiel: resultado }, { merge: true });
    this.testPielSubject.next(resultado);
  }

  async guardarCesta(usuario_id: string, productos: any[]) {
    const ref = doc(this.firestore, `usuarios/${usuario_id}`);
    await setDoc(ref, { cesta: productos }, { merge: true });
    this.cestaSubject.next(productos);
  }
}