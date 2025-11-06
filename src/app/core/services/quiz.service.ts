import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {QuestionView} from "../../pages/quiz/quiz.model";



@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // private baseUrl = environment.apiUrl;
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  generateQuiz(topic: string, quantity = 5): Observable<QuestionView[]>{
    const body = {
      topic,
      quantity
    }
    return this.http.post<QuestionView[]>(`${this.baseUrl}/generate`, body);
  }

  submitAnswer(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/answer`, data);
  }

}
