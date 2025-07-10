import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-day-week-picker',
  standalone: true,
  imports: [
    MatIcon,
    NgClass, MatTooltip
  ],
  templateUrl: './day-week-picker.component.html',
  styleUrl: './day-week-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DayWeekPickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DayWeekPickerComponent),
      multi: true
    }
  ]
})
export class DayWeekPickerComponent implements ControlValueAccessor, Validator {
  dayOfWeek = DAYS_OF_WEEK;
  
  // ControlValueAccessor properties
  private _value: number[] = [];
  private _disabled = false;
  private _touched = false;
  
  // Callback functions for ControlValueAccessor
  private onChange = (value: number[]) => {};
  private onTouched = () => {};

  get value(): number[] {
    return this._value;
  }

  set value(value: number[]) {
    this._value = value || [];
    this.onChange(this._value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get touched(): boolean {
    return this._touched;
  }

  // ControlValueAccessor implementation
  writeValue(value: number[]): void {
    this._value = value || [];
  }

  registerOnChange(fn: (value: number[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  // Validator implementation
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value || [];
    if (!value || value.length === 0) {
      return { required: true };
    }
    return null;
  }

  toggleDay(dayValue: number): void {
    if (this._disabled) return;
    
    // Mark as touched
    if (!this._touched) {
      this._touched = true;
      this.onTouched();
    }

    // Handle FormControl mode
    const currentValue = [...this._value];
    const index = currentValue.indexOf(dayValue);
    
    if (index >= 0) {
      // Don't allow removing the last day
      if (currentValue.length === 1) return;
      currentValue.splice(index, 1);
    } else {
      currentValue.push(dayValue);
    }
    
    this.value = currentValue.sort((a, b) => a - b);
  }

  isSelected(dayValue: number): boolean {
    return this._value.includes(dayValue);
  }

  // Utility methods
  getSelectedDaysInfo(): { values: number[], descriptions: string[] } {
    const selectedDays = this._value.sort((a, b) => a - b);
    const descriptions = selectedDays.map(day => 
      this.dayOfWeek.find(d => d.value === day)?.description || ''
    );
    
    return {
      values: selectedDays,
      descriptions
    };
  }

  hasValidSelection(): boolean {
    return this._value.length > 0;
  }

  // Additional utility methods
  selectAllDays(): void {
    if (this._disabled) return;
    this.value = this.dayOfWeek.map(day => day.value);
  }

  selectWeekdays(): void {
    if (this._disabled) return;
    this.value = [1, 2, 3, 4, 5]; // Lunes a Viernes
  }

  selectWeekends(): void {
    if (this._disabled) return;
    this.value = [0, 6]; // Domingo y Sábado
  }

}

const DAYS_OF_WEEK = [
  { label: 'D', value: 0, description: 'Domingo' },
  { label: 'L', value: 1, description: 'Lunes' },
  { label: 'M', value: 2, description: 'Martes' },
  { label: 'X', value: 3, description: 'Miércoles' },
  { label: 'J', value: 4, description: 'Jueves' },
  { label: 'V', value: 5, description: 'Viernes' },
  { label: 'S', value: 6, description: 'Sábado' },
];