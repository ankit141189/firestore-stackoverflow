import { Component, OnInit } from '@angular/core';
import { Question, QuestionService } from '../question.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { TopicTag, TagsService } from '../tags.service';

@Component({
  selector: 'app-topic-questions',
  templateUrl: './topic-questions.component.html',
  styleUrls: ['./topic-questions.component.css']
})
export class TopicQuestionsComponent implements OnInit {

  questions: Question[]
  topic: TopicTag
  constructor(private questionService: QuestionService, private route : ActivatedRoute, private tagsService: TagsService) { }

  ngOnInit() {
    this.route.paramMap.pipe(map(paramMap => paramMap.get('topicId')))
      .subscribe(topicId => {
        console.log('Searching questions for topic', topicId)
        this.questionService.searchByTopic(topicId).then(res => {
          this.questions = res
         })
         this.tagsService.get(topicId).then(topic => {
           this.topic = topic
         })
      });
  }

}
