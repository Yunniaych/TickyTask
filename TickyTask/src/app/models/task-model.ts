export class TaskModel {
    constructor(
        public id: number,
        public description: string,
        public completed: boolean
    ) {}

    toggleStatus(): void {
        this.completed = !this.completed;
    }

    changeDescription(newDescription: string): void {
        this.description = newDescription;
    }

}
