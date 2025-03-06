import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve tasks from API', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
      { id: 2, title: 'Task 2', description: 'Description 2', completed: true }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should retrieve a single task by id', () => {
    const mockTask = { id: 1, title: 'Task 1', description: 'Description 1', completed: false };

    service.getTask(1).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne('api/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should add a new task', () => {
    const newTask = { id: 3, title: 'Task 3', description: 'New task', completed: false };
  
    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });
  
    const req = httpMock.expectOne('api/tasks');
    expect(req.request.method).toBe('POST');
    req.flush(newTask);
  });

  it('should delete a task', () => {
    const taskId = 3;
  
    service.deleteTask(taskId).subscribe(() => {
      expect(true).toBe(true);
    });
  
    const req = httpMock.expectOne(`api/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update a task by id', () => {
    const task: Task = { id: 3, title: 'Task 3', description: 'New task', completed: false };
  
    service.updateTask(task).subscribe(updatedTask => {
      expect(updatedTask).toEqual(task);
    });
  
    const req = httpMock.expectOne('api/tasks/3');
    expect(req.request.method).toBe('PUT');
    req.flush(task);
  });
});
