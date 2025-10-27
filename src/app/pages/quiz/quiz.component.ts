import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { QuizService } from "../../core/services/quiz.service";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {

  topic: string = '';
  questions: any[] = [];
  currentIndex = 0;
  loading = false;
  showResult = false;
  score = 0;

  selectedOption: string | null = null;
  isAnswered = false;
  feedback: string = '';
  showNextButton = false;

  // Temporizador
  timeLeft = 20;
  timer: any;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
  ) {}

  ngOnInit(): void {
    this.topic = this.route.snapshot.queryParamMap.get('topic') || '';
    if (this.topic) this.loadQuiz();
  }

  loadQuiz() {
    this.loading = true;
    this.quizService.generateQuiz(this.topic).subscribe({
      next: (res) => {
        // Mezcla aleatoriamente las preguntas
        this.questions = (res || []).sort(() => Math.random() - 0.5);

        console.log("Preguntas cargadas (mezcladas):", this.questions);

        this.loading = false;
        this.startTimer(); // inicia el temporizador para la primera pregunta
      },
      error: (err) => {
        console.error('Error al cargar quiz:', err);
        this.loading = false;
      },
    });
  }


  startTimer() {
    this.timeLeft = 20;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeout();
      }
    }, 1000);
  }

  handleTimeout() {
    this.isAnswered = true;
    this.feedback = `Se acabó el tiempo. La respuesta correcta era: ${this.questions[this.currentIndex].respuesta_correcta}`;
    this.showNextButton = true;
  }

  answerQuestion(opcion: string) {
    if (this.isAnswered) return;

    this.selectedOption = opcion;
    this.isAnswered = true;
    clearInterval(this.timer);

    const correcta = this.questions[this.currentIndex].respuesta_correcta;
    const letraSeleccionada = opcion.trim().charAt(0);

    if (letraSeleccionada === correcta) {
      this.feedback = '✅ ¡Correcto!';
      this.score++;
    } else {
      this.feedback = `Incorrecto. La respuesta correcta era: ${correcta}`;
    }

    this.showNextButton = true;
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.selectedOption = null;
      this.feedback = '';
      this.isAnswered = false;
      this.showNextButton = false;
      this.startTimer();
    } else {
      this.showResult = true;
      clearInterval(this.timer);
    }
  }
}
