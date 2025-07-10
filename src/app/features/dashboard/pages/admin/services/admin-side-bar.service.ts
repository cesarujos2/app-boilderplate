import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AdminSideBarService {
    private isOpenSignal = signal<boolean>(false);
    public isOpen = this.isOpenSignal.asReadonly();

    constructor() { }

    toggle(): void {
        this.isOpenSignal.update((current) => !current);
    }

    open(): void {
        this.isOpenSignal.set(true);
    }

    close(): void {
        this.isOpenSignal.set(false);
    }

}