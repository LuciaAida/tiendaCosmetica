import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private admin: boolean = false;
  private testPielSubject = new BehaviorSubject<string | null>(null);
  testPiel$ = this.testPielSubject.asObservable();

  constructor(private firestore: Firestore) { }

  setAdmin(value: boolean) {
    this.admin = value;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  loadTestPiel(uid: string) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    getDoc(ref).then(snap => {
      const data = snap.data();
      this.testPielSubject.next(data?.['testPiel'] ?? null);
    });
  }

  /** Guarda o sobrescribe el test de piel para este usuario */
  saveTestPiel(uid: string, resultado: string) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    setDoc(ref, { testPiel: resultado }, { merge: true })
      .then(() => this.testPielSubject.next(resultado))
      .catch(error => console.error("Error guardando test:", error));
  }
}