import { Injectable, signal } from '@angular/core';
import { Datasheet } from '../models/datasheet.interface';

/**
 * Store Service - SRP: Solo responsable del estado
 */
@Injectable({
  providedIn: 'root'
})
export class DatasheetStore {
  private datasheetList = signal<Datasheet[]>([]);
  readonly datasheets = this.datasheetList.asReadonly();

  private totalDatasheets = signal<number>(0);
  readonly total = this.totalDatasheets.asReadonly();

  private isLoading = signal<boolean>(false);
  readonly loading = this.isLoading.asReadonly();

  setDatasheets(datasheets: Datasheet[]): void {
    this.datasheetList.set(datasheets);
  }

  setTotal(total: number): void {
    this.totalDatasheets.set(total);
  }

  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  clear(): void {
    this.datasheetList.set([]);
    this.totalDatasheets.set(0);
    this.isLoading.set(false);
  }

  removeDatasheet(id: number): void {
    const currentDatasheets = this.datasheetList();
    const updatedDatasheets = currentDatasheets.filter(ds => ds.id !== id);
    this.datasheetList.set(updatedDatasheets);
  }
}
