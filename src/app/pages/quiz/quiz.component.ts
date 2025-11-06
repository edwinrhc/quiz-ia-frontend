import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { QuizService } from "../../core/services/quiz.service";
import {QuestionView} from "./quiz.model";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {

  topic: string = '';
  quantity = 5;

  questions: QuestionView[] = [];
  currentIndex = 0;

  loading = false;
  showResult = false;
  score = 0;

  selections: number[]  = [];


  selectedOption: string | null = null;
  isAnswered = false;
  feedback: string = '';
  showNextButton = false;

  // Temporizador
  timeLeft = 20;
  private timer: any;

  readonly letters = ['A', 'B', 'C', 'D'];

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
    this.showResult = false;
    this.score = 0;
    this.currentIndex = 0;

    this.quizService.generateQuiz(this.topic, this.quantity).subscribe({
      next: (res) => {
        this.questions = (res || []).map(q => this.shuffleKeepingAnswer(q));
        this.selections = Array(this.questions.length).fill(-1);
        this.loading = false;
        this.startTimer();
      },
      error: (err) => {
        console.error('Error al cargar quiz:', err);
        this.loading = false;
      }
    });
  }


  startTimer() {
    this.timeLeft = 20;
    this.isAnswered = false;
    this.feedback = '';
    this.showNextButton = false;

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeout();
      }
    }, 1000);
  }

  private autoFailCurrent(): void {
    // si no marcó nada, se queda en -1 y seguimos
    this.nextQuestion();
  }

  selectOption(optionIndex: number): void {
    if (this.isAnswered) return;

    this.selections[this.currentIndex] = optionIndex;
    this.isAnswered = true;
    clearInterval(this.timer);

    const correct = this.questions[this.currentIndex].correctIndex;
    if (optionIndex === correct) {
      this.feedback = '¡Correcto!';
      this.score++;
    } else {
      this.feedback = `Incorrecto. La respuesta correcta era: ${this.letters[correct]}.`;
    }

    this.showNextButton = true;
  }

  handleTimeout() {
    this.isAnswered = true;
    const correct = this.questions[this.currentIndex].correctIndex;
    this.feedback = `⏳ Se acabó el tiempo. La respuesta correcta era: ${this.letters[correct]}.`;
    this.showNextButton = true;
  }

  /*answerQuestion(opcion: string) {
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
  }*/

/*  nextQuestion(): void {
    clearInterval(this.timer);
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startTimer();
    } else {
      // Calcular puntaje
      this.score = this.questions.reduce((acc, q, idx) =>
        acc + (this.selections[idx] === q.correctIndex ? 1 : 0), 0
      );
      this.showResult = true;
    }
  }*/

  nextQuestion(): void {
    clearInterval(this.timer);
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startTimer();
    } else {
      this.showResult = true;
    }
  }

  reset(): void {
    this.questions = [];
    this.selections = [];
    this.currentIndex = 0;
    this.score = 0;
    this.showResult = false;
    clearInterval(this.timer);
  }

  // Baraja opciones y recalcula correctIndex
  private shuffleKeepingAnswer(q: QuestionView): QuestionView {
    const pairs = q.opciones.map((text, i) => ({ text, i }));
    pairs.sort(() => Math.random() - 0.5);
    const newCorrectIndex = pairs.findIndex(p => p.i === q.correctIndex);
    return {
      ...q,
      opciones: pairs.map(p => p.text),
      correctIndex: newCorrectIndex
    };
  }
}
