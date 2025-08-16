import { TaskModel } from './task-model';

describe('TaskModel', () => {
  it('should create an instance', () => {
    expect(new TaskModel(1, 'Test task', false)).toBeTruthy();
  });
});
