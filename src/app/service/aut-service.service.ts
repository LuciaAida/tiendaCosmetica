import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // API modular
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment'; // Asegúrate de que importes tu configuración de Firebase
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private usuarioAutenticado = new BehaviorSubject<boolean>(false);
  private nombreUsuario = new BehaviorSubject<string>('');

  constructor() {
    initializeApp(environment.firebase);
    this.auth = getAuth();

  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(userCredential => {
      this.usuarioAutenticado.next(true);
      this.nombreUsuario.next(userCredential.user.displayName || userCredential.user.email || 'Usuario');
    });
  }
  
  logout(){
    signOut(this.auth).then(() =>{
      this.usuarioAutenticado.next(false);
      this.nombreUsuario.next('');
    });
  }


  register(email: string, password: string) { 
    return createUserWithEmailAndPassword(this.auth, email, password).then(userCredential => {
      this.usuarioAutenticado.next(true);
      this.nombreUsuario.next(userCredential.user.displayName || userCredential.user.email || 'Usuario');
    });
  }

   get estaAutenticado(){
     return this.usuarioAutenticado.asObservable();
   }

   get nombreUsuario$(){
     return this.nombreUsuario.asObservable();
   }
  
}
