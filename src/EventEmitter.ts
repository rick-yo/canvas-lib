interface EventFn {
  (...arg: any[]): void;
}

export default class EventEmitter {
  events: {
    [key: string]: EventFn[];
  } = {};
  constructor() {}
  on(type: string, fn: EventFn) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(fn);
  }
  off(type: string, fn: EventFn) {
    this.events[type] = this.events[type] || [];
    const index = this.events[type].indexOf(fn);
    if (index > -1) {
      this.events[type].splice(index, 1);
    }
  }
  emit(type: string, ...arg: any[]) {
    this.events[type] = this.events[type] || [];
    this.events[type].forEach(fn => fn(...arg));
  }
}
