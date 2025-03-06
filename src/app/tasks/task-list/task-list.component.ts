import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit(): void {}

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks$ = this.taskService.getTasks(); // Обновляем список после удаления
    });
  }
}
