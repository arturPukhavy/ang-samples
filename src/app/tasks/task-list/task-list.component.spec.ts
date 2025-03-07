import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { RouterLink,  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { Task } from '../../models/task';
import { RouterTestingModule } from '@angular/router/testing';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', ['getTasks']);
    mockTaskService.getTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterLink,
        TaskListComponent,
        RouterTestingModule
      ],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges(); // Добавляем для инициализации
    expect(component).toBeTruthy();
  });

  it('should display tasks from the service', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
      { id: 2, title: 'Task 2', description: 'Description 2', completed: true }
    ];
    component.tasks$ = of(mockTasks); // Обходим mockTaskService
    fixture.detectChanges();
  
    const taskElements = fixture.nativeElement.querySelectorAll('li');
    expect(taskElements.length).toBe(2);
    expect(taskElements[0].textContent).toContain('Task 1');
    expect(taskElements[0].textContent).toContain('(In Progress)');
    expect(taskElements[1].textContent).toContain('Task 2');
    expect(taskElements[1].textContent).toContain('(Completed)');
  });

  it('should display "No tasks yet" when there are no tasks', async () => {
    mockTaskService.getTasks.and.returnValue(of([]));

    component.ngOnInit(); // Явно вызываем ngOnInit
    fixture.detectChanges();
    await fixture.whenStable();

    const noTasksMessage = fixture.nativeElement.querySelector('p');
    expect(noTasksMessage).toBeTruthy();
    expect(noTasksMessage.textContent).toContain('No tasks yet');
  });

  it('should have a create button with correct routerLink', () => {
    fixture.detectChanges(); // Обновляем компонент, чтобы DOM появился
  
    const createButton = fixture.nativeElement.querySelector('button'); // Находим первую кнопку
    expect(createButton).toBeTruthy(); // Проверяем, что кнопка есть
    expect(createButton.textContent).toContain('Create New Task'); // Проверяем текст
    expect(createButton.getAttribute('ng-reflect-router-link')).toBe('/tasks/create'); // Проверяем routerLink
  });

  it('should call deleteTask when delete button is clicked', () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'D1', completed: false }];
    component.tasks$ = of(mockTasks);
    mockTaskService.deleteTask.and.returnValue(of(undefined)); // Мокаем deleteTask
    fixture.detectChanges();
  
    const deleteButton = fixture.nativeElement.querySelector('li button');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toContain('Delete');
    deleteButton.click();
  
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1); // Проверяем, что вызван с ID 1
  });

  it('should have task links with correct routerLink', () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'D1', completed: false }];
    component.tasks$ = of(mockTasks);
    fixture.detectChanges();
  
    const taskLink = fixture.nativeElement.querySelector('li a');
    expect(taskLink).toBeTruthy();
    expect(taskLink.textContent).toContain('Task 1');
    expect(taskLink.getAttribute('ng-reflect-router-link')).toBe('/tasks/1');
  });

  it('should show task status in span', () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'D1', completed: false }];
    component.tasks$ = of(mockTasks);
    fixture.detectChanges();
  
    const statusSpan = fixture.nativeElement.querySelector('li span');
    expect(statusSpan).toBeTruthy();
    expect(statusSpan.textContent).toContain('(In Progress)');
  });

  it('should show completed status in span', () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'D1', completed: true }];
    component.tasks$ = of(mockTasks);
    fixture.detectChanges();
  
    const statusSpan = fixture.nativeElement.querySelector('li span');
    expect(statusSpan).toBeTruthy();
    expect(statusSpan.textContent).toContain('(Completed)');
  });

  it('should show correct links for multiple tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'D1', completed: false },
      { id: 2, title: 'Task 2', description: 'D2', completed: true }
    ];
    component.tasks$ = of(mockTasks);
    fixture.detectChanges();
  
    const taskElements = fixture.nativeElement.querySelectorAll('li a');
    expect(taskElements.length).toBe(2);
    expect(taskElements[0].textContent).toContain('Task 1');
    expect(taskElements[1].textContent).toContain('Task 2');
    expect(taskElements[0].getAttribute('ng-reflect-router-link')).toBe('/tasks/1');
    expect(taskElements[1].getAttribute('ng-reflect-router-link')).toBe('/tasks/2');
  });

  it('should not show delete button when no tasks', () => {
    component.tasks$ = of([]);
    fixture.detectChanges();
  
    const deleteButton = fixture.nativeElement.querySelector('li button');
    expect(deleteButton).toBeNull();
  });

  it('should remove task after delete button click', () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Task 1', description: 'D1', completed: false }];
    component.tasks$ = of(mockTasks);
    mockTaskService.deleteTask.and.returnValue(of(undefined));
    mockTaskService.getTasks.and.returnValue(of([]));
    fixture.detectChanges();
  
    const deleteButton = fixture.nativeElement.querySelector('li button');
    deleteButton.click();
    fixture.detectChanges();
    
    const taskElements = fixture.nativeElement.querySelectorAll('li');
    expect(taskElements.length).toBe(0);
  });
});
