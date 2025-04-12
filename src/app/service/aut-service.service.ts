import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // API modular
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment'; // Asegúrate de que importes tu configuración de Firebase
import { BehaviorSubject } from 'rxjs';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private firestore: Firestore;
  private usuarioAutenticado = new BehaviorSubject<boolean>(false);
  private nombreUsuario = new BehaviorSubject<string>('');
  private esAdmin = new BehaviorSubject<boolean>(false);

  constructor() {
    initializeApp(environment.firebase);
    this.auth = getAuth();
    this.firestore = getFirestore();
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(userCredential => {
      this.usuarioAutenticado.next(true);
      this.nombreUsuario.next(userCredential.user.displayName || userCredential.user.email || 'Usuario');

      const uid = userCredential.user.uid; //obtener id del usuario
      this.setAdmin(uid);
    });
  }
  
  logout(){
    signOut(this.auth).then(() =>{
      this.usuarioAutenticado.next(false);
      this.nombreUsuario.next('');
      this.esAdmin.next(false);
    });
  }


  register(email: string, password: string, nombre: string) { 
    return createUserWithEmailAndPassword(this.auth, email, password).then(userCredential => {
      this.usuarioAutenticado.next(true);
      this.nombreUsuario.next(userCredential.user.displayName || userCredential.user.email || 'Usuario');

      const uid = userCredential.user.uid; //obtener id del usuario
      this.setAdmin(uid);

      //guardar en firestore
      setDoc(doc(this.firestore, 'usuarios', uid),{
        correo: email,
        nombre:nombre,
        soyAdmin: false
      })
    });
  }

  setAdmin(uid: string){
    getDoc(doc(this.firestore,'usuarios',uid)).then((docSnap) =>{
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.esAdmin.next(data?.['soyAdmin'] || false);  // Establecemos si el usuario es admin
      }
    });
  }

   get estaAutenticado(){
     return this.usuarioAutenticado.asObservable();
   }

   get nombreUsuario$(){
     return this.nombreUsuario.asObservable();
   }

   get esAdmin$(){
    return this.esAdmin.asObservable();
   }
  
}
