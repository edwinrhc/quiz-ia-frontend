import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // private baseUrl = 'https://quizia-dveu.onrender.com/api/quiz';
  private baseUrl = 'http://localhost:8080/api/quiz';

  constructor(private http: HttpClient) { }

  generateQuiz(topic: string): Observable<any>{
    const body = {
      topic,
      quantity: 5
    }
    return this.http.post(`${this.baseUrl}/generate`, body);
  }

  submitAnswer(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/answer`, data);
  }

}
