export interface usuarioModelo {
    usuario_id: number; 
    nombre: string;
    correo: string;
    contrasenia: string;
    confContrasenia: string;   
    esAdmin: boolean;
    testPiel?: string;
    testPelo?: string;
  }