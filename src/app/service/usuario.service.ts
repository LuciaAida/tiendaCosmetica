import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private admin: boolean = false;

  constructor() { }

  setAdmin(value: boolean){
      this.admin = value;
    }
  
    isAdmin():boolean{
      return this.admin;
    }
}
