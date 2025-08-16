import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task-model';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'todo-tasks';
  private tasksSubject = new BehaviorSubject<TaskModel[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasksFromStorage();
  }

  private loadTasksFromStorage(): void {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    if (storedTasks) {
      try {
        const tasksData = JSON.parse(storedTasks);
        const tasks = tasksData.map((task: any) => 
          new TaskModel(task.id, task.description, task.completed)
        );
        this.tasksSubject.next(tasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        this.tasksSubject.next([]);
      }
    }
  }

  private saveTasksToStorage(): void {
    const tasks = this.tasksSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  getTasks(): Observable<TaskModel[]> {
    return this.tasks$;
  }

  addTask(description: string): void {
    const currentTasks = this.tasksSubject.value;
    const newId = currentTasks.length > 0 
      ? Math.max(...currentTasks.map(task => task.id)) + 1 
      : 1;
    
    const newTask = new TaskModel(newId, description, false);
    const updatedTasks = [...currentTasks, newTask];
    
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage();
  }

  updateTask(taskId: number, newDescription: string): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        task.changeDescription(newDescription);
      }
      return task;
    });
    
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage();
  }

  toggleTaskStatus(taskId: number): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        task.toggleStatus();
      }
      return task;
    });
    
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage();
  }

  deleteTask(taskId: number): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage();
  }

  getPendingTasks(): Observable<TaskModel[]> {
    return new BehaviorSubject(
      this.tasksSubject.value.filter(task => !task.completed)
    ).asObservable();
  }

  getCompletedTasks(): Observable<TaskModel[]> {
    return new BehaviorSubject(
      this.tasksSubject.value.filter(task => task.completed)
    ).asObservable();
  }
}