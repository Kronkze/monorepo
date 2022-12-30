export interface Clock {
    now(): Date
}

export class SystemClock implements Clock {
    now() {
        return new Date()
    }
}

export class FixedClock implements Clock {
    constructor(private readonly when: Date) {
    }

    now() {
        return this.when
    }
}

export let clock = new SystemClock()

