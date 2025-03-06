import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  taskForm: FormGroup;
  isNew: boolean = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          this.isNew = this.route.snapshot.routeConfig?.path === 'tasks/create';
          if (this.isNew) {
            this.taskId = null;
            return of(null);
          }
          this.taskId = id ? parseInt(id, 10) : null;
          if (this.taskId && !isNaN(this.taskId)) {
            return this.taskService.getTask(this.taskId);
          }
          this.router.navigate(['/tasks']);
          return of(null);
        })
      )
      .subscribe(task => {
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            completed: task.completed
          });
        }
      });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = {
        ...this.taskForm.value,
        id: this.isNew ? 0 : this.taskId! // ID будет сгенерирован InMemoryWebApi
      };
      if (this.isNew) {
        this.taskService.addTask(task).subscribe(() => this.router.navigate(['/tasks']));
      } else {
        this.taskService.updateTask(task).subscribe(() => this.router.navigate(['/tasks']));
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}