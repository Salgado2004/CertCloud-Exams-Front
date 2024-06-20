import { Component, Input, ViewChild } from '@angular/core';
import { QuestionInterface } from '../../utils/question-interface';
import { DinamicLoaderDirective } from '../../utils/dinamic-loader.directive';
import { MultipleQuestionComponent } from '../questoes/multiple-question/multiple-question.component';
import { OptionsQuestionComponent } from '../questoes/options-question/options-question.component';
import { SelectQuestionComponent } from '../questoes/select-question/select-question.component';
import { TrueFalseQuestionComponent } from '../questoes/true-false-question/true-false-question.component';
import { QuestionStructure } from '../../utils/question-structure';
import { ActivatedRoute } from '@angular/router';
import { SimuladoEventsService } from '../../utils/simulado-events.service';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css'
})
export class QuestionCardComponent {
  @ViewChild(DinamicLoaderDirective) private dynamicHost!: DinamicLoaderDirective; 
  @Input() questionData: QuestionInterface;
  @Input() questionIndex: number;
  questionType: string;
  totalQuestions: string;
  questionInstance: any;

  constructor(private activatedRoute : ActivatedRoute) { }

  ngOnInit(){
    this.totalQuestions = this.activatedRoute.snapshot.paramMap.get("questions");
  }

  ngAfterViewInit() {
    this.loadQuestionComponent();
  }

  loadQuestionComponent() {
    this.questionType = this.questionData.type;
    this.dynamicHost.view.clear();

    const questionComponentMap = {
      'multiple': MultipleQuestionComponent,
      'options': OptionsQuestionComponent,
      'select': SelectQuestionComponent,
      'truefalse': TrueFalseQuestionComponent,
    };
    const questionComponentType = questionComponentMap[this.questionType];

    const viewContainerRef = this.dynamicHost.view;
    this.questionInstance = viewContainerRef.createComponent<QuestionStructure>(questionComponentType);
    this.questionInstance.instance.id = "question"+this.questionIndex;
    this.questionInstance.instance.body = this.questionData.body;
    this.questionInstance.instance.options = this.questionData.options;
    this.questionInstance.instance.correct = this.questionData.correct;
    this.questionInstance.instance.showNext = (this.questionIndex < Number.parseInt(this.totalQuestions));
  }

  finishExam(){
    SimuladoEventsService.get('endExam').emit(this.questionInstance.instance.score());
  }
}
