import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TaskModel } from '../../models/task-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  imports: [FormsModule],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  @Input() task!: TaskModel;
  @Output() toggle = new EventEmitter<TaskModel>();
  @Output() delete = new EventEmitter<TaskModel>();
  @Output() edit = new EventEmitter<{ task: TaskModel; newDescription: string }>();

  editedDescription = '';
  isEditing = false;

  onToggle(): void {
    this.toggle.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task);
  }

  startEditing(): void {
    this.isEditing = true;
    this.editedDescription = this.task.description;
  }

  saveEdit(): void {
    if (this.editedDescription.trim() && this.editedDescription !== this.task.description) {
      this.edit.emit({
        task: this.task,
        newDescription: this.editedDescription.trim()
      });
    }
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedDescription = '';
  }
}
