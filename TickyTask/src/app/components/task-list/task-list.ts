import { Component, inject } from '@angular/core';
import { TaskModel } from '../../models/task-model';
import { TaskService } from '../../services/task-service';
import { Task } from '../task/task';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, Task, AsyncPipe, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  private taskService = inject(TaskService);
  
  showTaskForm = false;
  newTaskDescription = '';
  filter$ = new BehaviorSubject<'all' | 'pending' | 'completed'>('all');

  // ordenar descendente por ID
  tasks$: Observable<TaskModel[]> = this.filter$.pipe(
    switchMap(filter => {
      switch(filter) {
        case 'pending': return this.taskService.getPendingTasks();
        case 'completed': return this.taskService.getCompletedTasks();
        default: return this.taskService.getTasks();
      }
    }),
    map(tasks => tasks.sort((a, b) => b.id - a.id))
  );

  //mostrar o no formulario de añadir tarea
  toggleTaskForm(): void {
    this.showTaskForm = !this.showTaskForm;
    if (this.showTaskForm) {
      setTimeout(() => {
        const input = document.getElementById('new-task-input');
        if (input) input.focus();
      });
    } 
  }

  addTask(): void {
    if (this.newTaskDescription.trim()) {
      this.taskService.addTask(this.newTaskDescription.trim());
      this.newTaskDescription = '';
      this.showTaskForm = false;
    }
  }

  cancelAddTask(): void {
    this.newTaskDescription = '';
    this.showTaskForm = false;
  }

  handleTaskToggle(task: TaskModel): void {
    this.taskService.toggleTaskStatus(task.id);
  }

  handleTaskEdit(event: { task: TaskModel; newDescription: string }): void {
    this.taskService.updateTask(event.task.id, event.newDescription);
  }

  handleTaskDelete(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  changeFilter(newFilter: 'all' | 'pending' | 'completed'): void {
    this.filter$.next(newFilter);
  }
}