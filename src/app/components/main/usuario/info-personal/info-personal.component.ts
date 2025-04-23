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
  descripcionesTiposPiel : { [key: string]: string } = {
    normal: 'Tu piel tiene un equilibrio perfecto de hidratación y grasa.',
    seca: 'Tu piel necesita más hidratación y protección contra la pérdida de agua.',
    grasa: 'Tu piel produce más sebo de lo normal, necesita regulación.',
    mixta: 'Tienes zonas más grasas (generalmente frente y nariz) y otras más secas.',
    sensible: 'Tu piel reacciona fácilmente a factores externos o productos.'
  };
  preguntasPiel = [
    { texto: '¿Cómo sientes tu piel después de lavarla?', opciones: ['Tensa', 'Grasa', 'Normal', 'Sensible'] },
    { texto: '¿Con qué frecuencia ves brillos?', opciones: ['Siempre', 'A veces', 'Nunca', 'Solo en zonas específicas'] },
    { texto: '¿Tu piel se descama o enrojece con facilidad?', opciones: ['Sí', 'No'] },
    { texto: '¿Qué textura tiene tu piel al tacto?', opciones: ['Suave', 'Gruesa', 'Irregular'] },
    { texto: '¿Tienes zonas con acné o espinillas?', opciones: ['Sí', 'No'] },
  ];
  respuestasPiel: string[] = Array(this.preguntasPiel.length).fill('');
  tipoDetectado: string | null = null;
  mostrarTest = false;

  constructor(private authService: AuthService, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.authService.estaAutenticado.subscribe(autenticado => {
      if (autenticado) {
        this.usuarioId = this.authService.getUsuarioId();
        this.cargarTestUsuario();

        this.usuarioService.testPiel$.subscribe(resultado => {
          this.tipoDetectado = resultado;
        });
      }
    });
  }

  cargarTestUsuario() {
    if (this.usuarioId) {
      this.usuarioService.loadTestPiel(this.usuarioId); // Cargamos el test de piel
    }
  }

  guardarResultado() {
    if (this.usuarioId) {
      const resultado = this.calcularTipoPiel(this.respuestasPiel);
      this.usuarioService.saveTestPiel(this.usuarioId, resultado); // ✅ Usa el servicio correcto
      this.mostrarTest = false;
    }
  }

  private calcularTipoPiel(respuestas: string[]): string {
    const scores = {
      normal: 0,
      seca: 0,
      grasa: 0,
      mixta: 0,
      sensible: 0
    };

    // Pregunta 1: ¿Cómo sientes tu piel después de lavarla?
    switch (respuestas[0]) {
      case 'Tensa': scores.seca += 2; break;
      case 'Grasa': scores.grasa += 2; break;
      case 'Normal': scores.normal += 2; break;
      case 'Sensible': scores.sensible += 2; break;
    }

    // Pregunta 2: ¿Con qué frecuencia ves brillos?
    switch (respuestas[1]) {
      case 'Siempre': scores.grasa += 3; break;
      case 'A veces': scores.mixta += 2; break;
      case 'Nunca': scores.seca += 2; break;
      case 'Solo en zonas específicas': scores.mixta += 3; break;
    }

    // Pregunta 3: ¿Tu piel se descama o enrojece con facilidad?
    switch (respuestas[2]) {
      case 'Sí':
        scores.seca += 1;
        scores.sensible += 2;
        break;
      case 'No':
        scores.normal += 1;
        scores.grasa += 1;
        break;
    }

    // Pregunta 4: ¿Qué textura tiene tu piel al tacto?
    switch (respuestas[3]) {
      case 'Suave': scores.normal += 2; break;
      case 'Gruesa': scores.grasa += 2; break;
      case 'Irregular':
        scores.mixta += 1;
        scores.sensible += 1;
        break;
    }

    // Pregunta 5: ¿Tienes zonas con acné o espinillas?
    switch (respuestas[4]) {
      case 'Sí':
        scores.grasa += 2;
        scores.mixta += 1;
        break;
      case 'No':
        scores.normal += 1;
        scores.seca += 1;
        break;
    }

    // Determinar el tipo con mayor puntuación
    let maxScore = Math.max(...Object.values(scores));
    let tipos = Object.entries(scores)
      .filter(([_, score]) => score === maxScore)
      .map(([tipo]) => tipo);

    // Priorizar en caso de empate
    if (tipos.length > 1) {
      if (tipos.includes('sensible')) return 'sensible';
      if (tipos.includes('mixta')) return 'mixta';
      if (tipos.includes('grasa')) return 'grasa';
    }

    return tipos[0];
  }

  volverAHacerTest() {
    this.mostrarTest = true;       // Mostrar el test nuevamente
    this.tipoDetectado = null;     // Resetear el resultado
    this.respuestasPiel.fill('');  // Limpiar respuestas anteriores
  }
}