import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {NgModule} from "@angular/core";
import {QuizComponent} from "./pages/quiz/quiz.component";

export const routes: Routes = [
  { path:'', component: HomeComponent},
  { path:'quiz', component: QuizComponent},
  {path:'**', redirectTo:''}
];

