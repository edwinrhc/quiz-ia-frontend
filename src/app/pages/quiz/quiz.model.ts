

export interface QuizRequest {

  topic: string;
  quantity: number;

}

export interface QuestionView {

  pregunta: string;
  opciones: string[];
  answerLetter: 'A' | 'B' | 'C' | 'D';
  correctIndex: number;
}
