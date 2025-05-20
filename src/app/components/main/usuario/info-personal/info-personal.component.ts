import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../service/usuario.service';
import { AuthService } from '../../../../service/aut-service.service';

@Component({
  selector: 'app-info-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info-personal.component.html',
  styleUrl: './info-personal.component.css'
})
export class InfoPersonalComponent {
  usuarioId: string | null = null;
  //PIEL
  descripcionesTiposPiel: { [key: string]: string } = {
    normal: 'Tu piel tiene un equilibrio perfecto de hidratación y grasa.',
    seca: 'Tu piel necesita más hidratación y protección contra la pérdida de agua.',
    grasa: 'Tu piel produce más sebo de lo normal, necesita regulación.',
    mixta: 'Tienes zonas más grasas (generalmente frente y nariz) y otras más secas.',
    sensible: 'Tu piel reacciona fácilmente a factores externos o productos.',
    nota: 'Recuerda que ante cualquier duda, es recomendable consultar con un especialista.'
  };
  preguntasPiel = [
    { texto: '¿Cómo sientes tu piel después de lavarla?', opciones: ['Tensa', 'Grasa', 'Normal', 'Sensible'] },
    { texto: '¿Con qué frecuencia ves brillos?', opciones: ['Siempre', 'A veces', 'Nunca', 'Solo en zonas específicas'] },
    { texto: '¿Tu piel se descama o enrojece con facilidad?', opciones: ['Sí', 'No'] },
    { texto: '¿Qué textura tiene tu piel al tacto?', opciones: ['Suave', 'Gruesa', 'Irregular'] },
    { texto: '¿Tienes zonas con acné o espinillas?', opciones: ['Sí', 'No'] }
  ];
  respuestasPiel: string[] = Array(this.preguntasPiel.length).fill('');
  tipoDetectadoPiel: string | null = null;
  mostrarTestPiel = false;

  //PELO
  descripcionesTiposPelo: { [key: string]: string } = {
    graso: 'Se ensucia rápido y se ve brillante. Necesita lavados frecuentes.',
    seco: 'Se ve opaco y se siente áspero. Le falta hidratación.',
    normal: 'Se mantiene limpio y suave por varios días. No necesita muchos cuidados.',
    mixto: 'Raíz grasa y puntas secas. Requiere productos equilibrados.',
    notaPelo: 'Recuerda que ante cualquier duda, es recomendable consultar con un especialista.'
  };
  preguntasPelo = [
    { texto: '¿Con qué frecuencia sientes que tu cabello se ve grasoso o sucio?', opciones: ['A las pocas horas de lavarlo', 'Al día siguiente de lavarlo', 'Después de 2 o más días', 'Raramente, casi nunca'] },
    { texto: '¿Cómo describirías el aspecto de tu cuero cabelludo?', opciones: ['Muy graso y con picor frecuente', 'Normal, sin molestias', 'Muy seco y con descamación', 'Sensible o con tendencia a irritarse'] },
    { texto: '¿Cómo se siente tu cabello al tacto?', opciones: ['Pegajoso o apelmazado', 'Suave y manejable', 'Áspero o quebradizo', 'Seco en las puntas, pero graso en la raíz'] },
    { texto: '¿Se te rompe o cae el cabello con facilidad?', opciones: ['Sí, constantemente', 'Ocasionalmente', 'Muy raramente', 'Solo cuando lo maltrato mucho'] },
    { texto: '¿Cómo responde tu cabello al clima (frío o humedad)?', opciones: ['Se vuelve muy graso', 'No cambia mucho', 'Se reseca fácilmente', 'Se encrespa o se vuelve opaco'] },
  ];
  respuestasPelo: string[] = Array(this.preguntasPelo.length).fill('');
  tipoDetectadoPelo: string | null = null;
  mostrarTestPelo = false;

  constructor(private authService: AuthService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.authService.estaAutenticado.subscribe(autenticado => {
      if (autenticado) {
        this.usuarioId = this.authService.getUsuarioId();
        this.cargarTestUsuario();

        this.usuarioService.testPiel$.subscribe(resultado => {
          this.tipoDetectadoPiel = resultado;
        });
        this.usuarioService.testPelo$.subscribe(resultadoPelo => {
          this.tipoDetectadoPelo = resultadoPelo;
        });
      }
    });
  }

  cargarTestUsuario() {
    if (this.usuarioId) {
      this.usuarioService.cargarDatosUsuario(this.usuarioId);
    }
  }

  guardarResultado(tipo: 'piel' | 'pelo') {
    if (tipo === 'piel') {
      this.tipoDetectadoPiel = this.calcularTipoPiel(this.respuestasPiel);
      this.mostrarTestPiel = false;
      if (this.usuarioId) {
        this.usuarioService.guardarTestPiel(this.usuarioId, this.tipoDetectadoPiel);
      }
    } else if (tipo === 'pelo') {
      this.tipoDetectadoPelo = this.calcularTipoPelo(this.respuestasPelo);
      this.mostrarTestPelo = false;
      if (this.usuarioId) {
        this.usuarioService.guardarTestPelo(this.usuarioId, this.tipoDetectadoPelo);
      }
    }
  }
  
  
  reiniciarTest(tipo: 'piel' | 'pelo') {
    if (tipo === 'piel') {
      this.tipoDetectadoPiel = null;
      this.respuestasPiel = Array(this.preguntasPiel.length).fill('');
    } else if (tipo === 'pelo') {
      this.tipoDetectadoPelo = null;
      this.respuestasPelo = Array(this.preguntasPelo.length).fill('');
    }
  }
  

  private calcularTipoPelo(respuestasPelo: string[]) {
    const puntuaciones = {
      normal: 0,
      seco: 0,
      graso: 0,
      mixto: 0
    };

    // Pregunta 1
    switch (respuestasPelo[0]) {
      case 'A las pocas horas de lavarlo': puntuaciones.graso += 3; break;
      case 'Al día siguiente de lavarlo': puntuaciones.graso += 2; break;
      case 'Después de 2 o más días': puntuaciones.normal += 2; break;
      case 'Raramente, casi nunca': puntuaciones.seco += 2; break;
    }

    // Pregunta 2
    switch (respuestasPelo[1]) {
      case 'Muy graso y con picor frecuente': puntuaciones.graso += 2; break;
      case 'Normal, sin molestias': puntuaciones.normal += 2; break;
      case 'Muy seco y con descamación': puntuaciones.seco += 3; break;
      case 'Sensible o con tendencia a irritarse': puntuaciones.seco += 1; break;
    }

    // Pregunta 3
    switch (respuestasPelo[2]) {
      case 'Pegajoso o apelmazado': puntuaciones.graso += 2; break;
      case 'Suave y manejable': puntuaciones.normal += 2; break;
      case 'Áspero o quebradizo': puntuaciones.seco += 2; break;
      case 'Seco en las puntas, pero graso en la raíz': puntuaciones.mixto += 3; break;
    }

    // Pregunta 4
    switch (respuestasPelo[3]) {
      case 'Sí, constantemente': puntuaciones.seco += 2; break;
      case 'Ocasionalmente': puntuaciones.mixto += 1; break;
      case 'Muy raramente': puntuaciones.normal += 2; break;
      case 'Solo cuando lo maltrato mucho': puntuaciones.normal += 1; break;
    }

    // Pregunta 5
    switch (respuestasPelo[4]) {
      case 'Se vuelve muy graso': puntuaciones.graso += 2; break;
      case 'No cambia mucho': puntuaciones.normal += 1; break;
      case 'Se reseca fácilmente': puntuaciones.seco += 2; break;
      case 'Se encrespa o se vuelve opaco': puntuaciones.mixto += 1; break;
    }

    let puntuacionMax = Math.max(...Object.values(puntuaciones)); //valor + alto de puntuaciones
    let tipos = Object.entries(puntuaciones) //clave, valor
      .filter(([_, score]) => score === puntuacionMax) //conserva solo la puntuación + alta
      .map(([tipo]) => tipo); //extrae solo los tipos

    // priorizar si hay empate
    if (tipos.length > 1) {
      if (tipos.includes('mixto')) return 'mixto';
      if (tipos.includes('graso')) return 'graso';
      if (tipos.includes('seco')) return 'seco';
    }

    return tipos[0];
  }

  private calcularTipoPiel(respuestas: string[]): string {
    const puntuacionesPiel = {
      normal: 0,
      seca: 0,
      grasa: 0,
      mixta: 0,
      sensible: 0
    };

    // pregunta 1
    switch (respuestas[0]) {
      case 'Tensa': puntuacionesPiel.seca += 2; break;
      case 'Grasa': puntuacionesPiel.grasa += 2; break;
      case 'Normal': puntuacionesPiel.normal += 2; break;
      case 'Sensible': puntuacionesPiel.sensible += 2; break;
    }

    // pregunta 2
    switch (respuestas[1]) {
      case 'Siempre': puntuacionesPiel.grasa += 3; break;
      case 'A veces': puntuacionesPiel.mixta += 2; break;
      case 'Nunca': puntuacionesPiel.seca += 2; break;
      case 'Solo en zonas específicas': puntuacionesPiel.mixta += 3; break;
    }

    // pregunta 3
    switch (respuestas[2]) {
      case 'Sí':
        puntuacionesPiel.seca += 1;
        puntuacionesPiel.sensible += 2;
        break;
      case 'No':
        puntuacionesPiel.normal += 1;
        puntuacionesPiel.grasa += 1;
        break;
    }

    // pregunta 4
    switch (respuestas[3]) {
      case 'Suave': puntuacionesPiel.normal += 2; break;
      case 'Gruesa': puntuacionesPiel.grasa += 2; break;
      case 'Irregular':
        puntuacionesPiel.mixta += 1;
        puntuacionesPiel.sensible += 1;
        break;
    }

    // pregunta 5
    switch (respuestas[4]) {
      case 'Sí':
        puntuacionesPiel.grasa += 2;
        puntuacionesPiel.mixta += 1;
        break;
      case 'No':
        puntuacionesPiel.normal += 1;
        puntuacionesPiel.seca += 1;
        break;
    }

    let maxPuntuacion = Math.max(...Object.values(puntuacionesPiel));
    let tipos = Object.entries(puntuacionesPiel)
      .filter(([_, score]) => score === maxPuntuacion)
      .map(([tipo]) => tipo);

    if (tipos.length > 1) {
      if (tipos.includes('sensible')) return 'sensible';
      if (tipos.includes('mixta')) return 'mixta';
      if (tipos.includes('grasa')) return 'grasa';
    }

    return tipos[0];
  }
}


