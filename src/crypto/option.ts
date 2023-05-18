export class Option<T> {
    value: T | null;

    constructor({value}: Option<T>) {
        this.value = value;
    }
}