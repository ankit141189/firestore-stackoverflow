import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { TagsService } from '../tags.service';
import { TopicTagDisplay } from '../question.service';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.css']
})
export class EditTagsComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: TopicTagDisplay[];
  tags: TopicTagDisplay[] = [];
  allTags: TopicTagDisplay[] = [];
  tagLokup: Map<string, TopicTagDisplay>;

  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(tagService: TagsService) {
    
    tagService.getAllTags().then(tags => {
      console.log(tags);
      this.allTags = tags.map(tag => {
       return {
         id: tag.id,
         name: tag.tagName
       } as TopicTagDisplay 
      });
      this.tagLokup = new Map();
      this.allTags.forEach(tag => this.tagLokup.set(tag.name.toLowerCase(), tag))
      this.filteredTags = this.filter();
    })
  }

  @Input()
  set initialValue(initialValue: TopicTagDisplay[]) {
    this.tags = initialValue ? initialValue.slice() : [];
    this.filteredTags = this.filter();
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      const normalizedValue = (value || '').trim().toLowerCase()
      if (normalizedValue && this.tagLokup.get(normalizedValue)) {
        this.tags.push(this.tagLokup.get(normalizedValue));
        this.filteredTags = this.filter();
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagCtrl.setValue(null);
    }
  }

  remove(tag: TopicTagDisplay): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.filteredTags = this.filter();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
    this.filteredTags = this.filter();
  }

  private filter(): TopicTagDisplay[] {
    const tagIds = this.tags.map(tag => tag.id)
    return this.allTags.filter(tag => !tagIds.includes(tag.id));
  }

  getTags(): TopicTagDisplay[] {
    return this.tags.slice();
  }

  getTagsControl(): FormControl {
    return this.tagCtrl;
  }

}
