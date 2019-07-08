interface EventFn {
  (...arg: any[]): void;
}

export default class EventEmitter {
  /**
   * Minimal implemention of EventEmitter
   * @memberof EventEmitter
   */
  events: {
    [key: string]: EventFn[];
  } = {};
  constructor() {}
  /**
   * Listening to a event
   *
   * @param {string} type
   * @param {EventFn} fn
   * @memberof EventEmitter
   */
  on(type: string, fn: EventFn) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(fn);
  }
  /**
   * Cancel listenning to a event
   *
   * @param {string} type
   * @param {EventFn} fn
   * @memberof EventEmitter
   */
  off(type: string, fn: EventFn) {
    this.events[type] = this.events[type] || [];
    const index = this.events[type].indexOf(fn);
    if (index > -1) {
      this.events[type].splice(index, 1);
    }
  }
  /**
   * Emit a event with specified arguments
   *
   * @param {string} type
   * @param {...any[]} arg
   * @memberof EventEmitter
   */
  emit(type: string, ...arg: any[]) {
    this.events[type] = this.events[type] || [];
    this.events[type].forEach(fn => fn(...arg));
  }
}
