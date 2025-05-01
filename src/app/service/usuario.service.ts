import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private admin: boolean = false;
  private testPielSubject = new BehaviorSubject<string | null>(null);
  private testPeloSubject = new BehaviorSubject<string | null>(null);
  testPiel$ = this.testPielSubject.asObservable();
  testPelo$ = this.testPeloSubject.asObservable();

  constructor(private firestore: Firestore) { }

  setAdmin(value: boolean) {
    this.admin = value;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  //pelo
  cargarTestPelo(uid: string) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    getDoc(ref).then(snap => {
      const data = snap.data();
      this.testPeloSubject.next(data?.['testPelo'] ?? null);
    });
  }

  guardarTestPelo(uid:string, resultado:string){
    const ref = doc(this.firestore,  `usuarios/${uid}`);
    setDoc(ref, { testPelo: resultado }, { merge: true })
      .then(() => this.testPeloSubject.next(resultado))
      .catch(error => console.error("Error guardando test:", error));
  }

 //piel
 cargarTestPiel(uid: string) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    getDoc(ref).then(snap => {
      const data = snap.data();
      this.testPielSubject.next(data?.['testPiel'] ?? null);
    });
  }

  guardarTestPiel(uid: string, resultado: string) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    setDoc(ref, { testPiel: resultado }, { merge: true })
      .then(() => this.testPielSubject.next(resultado))
      .catch(error => console.error("Error guardando test:", error));
  }
}
