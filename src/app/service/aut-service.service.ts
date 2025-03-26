import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // API modular
import { inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment'; // Asegúrate de que importes tu configuración de Firebase

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;


  constructor() {
    initializeApp(environment.firebaseConfig);
    this.auth = getAuth();

  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password); // Realiza el login
  }


  register(email: string, password: string) { 
    const a  =createUserWithEmailAndPassword(this.auth, email, password);
    console.log(a)
    return a
  }
  
}
