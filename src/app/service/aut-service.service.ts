import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // API modular
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment'; // Asegúrate de que importes tu configuración de Firebase
import { BehaviorSubject } from 'rxjs';
import { doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Firestore, getFirestore } from 'firebase/firestore';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private firestore: Firestore;
  private usuarioAutenticado = new BehaviorSubject<boolean>(false);
  private nombreUsuario = new BehaviorSubject<string>('');
  private esAdmin = new BehaviorSubject<boolean>(false);
  usuarioService: UsuarioService;

  constructor() {
    initializeApp(environment.firebase);
    this.auth = getAuth();
    this.firestore = getFirestore();
    this.usuarioService = new UsuarioService(this.firestore);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password).then(userCredential => {
      this.usuarioAutenticado.next(true);
      this.nombreUsuario.next(userCredential.user.displayName || userCredential.user.email || 'Usuario');

      const uid = userCredential.user.uid; //obtener id del usuario
      this.setAdmin(uid);
      this.usuarioService.cargarDatosUsuario(uid);
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


  getUsuarioId(): string | null {
    const user = this.auth.currentUser; // Obtenemos el usuario actual
    return user ? user.uid : null; // Si hay un usuario autenticado, devolvemos su UID
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
