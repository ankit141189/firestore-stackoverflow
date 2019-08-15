import { Component, OnInit } from '@angular/core';
import { TagsService, TopicTag } from '../tags.service';
import { UserService } from '../user.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribe-topics',
  templateUrl: './subscribe-topics.component.html',
  styleUrls: ['./subscribe-topics.component.css']
})
export class SubscribeTopicsComponent implements OnInit {

  updateInProgress = false
  topics: TopicTag[]
  selection: Map<string, boolean>
  constructor(private tagService: TagsService, private userService: UserService, private router: Router) {
   }

  ngOnInit() {    
    this.tagService.getAllTags().then(tags => {
      this.topics = tags;
      this.selection = new Map();
      this.topics.forEach(topic => this.selection.set(topic.id,
        topic.subscribers && topic.subscribers.includes(this.userService.currentUser.email)))
    });
  }

  isSelected(id: string) {
    return this.selection.get(id);
  }

  toggle(event: MatCheckboxChange) {
    this.selection.set(event.source.id, event.checked);
    console.log(this.selection);
  }

  update() {
    this.updateInProgress = true;
    this.tagService.updateSubscribers(this.selection).then(res => this.ngOnInit()).finally(() => {
      this.updateInProgress = false;
      console.log('tags update compete')
    });
  }

  routeToTopic(topicId: string) {
    this.router.navigate(['/topics', topicId]);

  }

}
