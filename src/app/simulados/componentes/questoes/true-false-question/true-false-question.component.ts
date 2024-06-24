import { Component, Input } from '@angular/core';
import { QuestionStructure } from '../../../utils/question-structure';
import { SimuladoEventsService } from '../../../utils/simulado-events.service';
import { QuestionSummary } from '../../../utils/question-summary';

@Component({
  selector: 'app-true-false-question',
  templateUrl: './true-false-question.component.html',
  styleUrls: ['./true-false-question.component.css', '../questao.css']
})
export class TrueFalseQuestionComponent implements QuestionStructure{
  id: string;
  header: string;
  body: string;
  options: string[];
  correct: string[];
  answers: string[] = [];
  showNext: boolean;
  active: boolean = true;
  summary: QuestionSummary = new Object() as QuestionSummary;

  verifyAnswer() {
    for (let i = 0; i < this.options.length; i++) {
      if (this.answers[i] == this.correct[i]) {
        document.querySelectorAll(`.${this.id}opt${i}`).forEach(element => {
          element.classList.add('correct', 'showAnswer');
        });
      } else{
        document.querySelectorAll(`.${this.id}opt${i}`).forEach(element => {
          element.classList.add('incorrect', 'showAnswer');
        });
      }
    }
    this.active = false;
  }

  score(){
    let total=0;
    this.answers.forEach((ans, index) => {
      total += ans == this.correct[index] ? 1 : 0;
    });
    return total/this.correct.length;
  }

  getSummary(){
    this.summary.header = this.header;
    this.summary.body = this.body;
    this.summary.options = this.options;
    this.summary.correct = this.correct;
    this.summary.answer = this.answers;
    this.summary.score = this.score();
    this.summary.right = this.score() == 1;
    return this.summary;
  }

  nextQuestion():void{
    SimuladoEventsService.get('nextQuestion').emit(this.getSummary());
  }
}
