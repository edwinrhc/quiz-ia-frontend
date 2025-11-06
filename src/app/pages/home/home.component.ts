import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  topic: string = '';
  currentYear: number = new Date().getFullYear();
  constructor(private router: Router) {}

  ngOnInit(): void {}


  startQuiz(){
    if(!this.topic.trim()) return;

    // Redirige al componente de quiz con el tema seleccionado
    this.router.navigate(['/quiz'], { queryParams: { topic: this.topic } });
  }

}
