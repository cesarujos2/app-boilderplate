import { NgClass } from '@angular/common';
import { Component, effect, input, model } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-vertical-stepper',
  standalone: true,
  imports: [
    NgClass,
    MatMiniFabButton, MatIcon
  ],
  templateUrl: './vertical-stepper.component.html',
  styleUrl: './vertical-stepper.component.scss'
})
export class VerticalStepperComponent {
  totalSteps = input.required<number>();
  currentStep = model.required<number>();
  formGroups = input.required<Array<FormGroup | null>>();
  visitedSteps: number[] = [];

  constructor() {
    effect(() => {
      const current = this.currentStep()
      if (!this.visitedSteps.includes(current)) {
        this.visitedSteps.push(current);
      }
    })
  }

  goToStep(step: number) {
    this.currentStep.set(step);
  }

  isStepVisited(step: number): boolean {
    return this.visitedSteps.includes(step);
  }

  isStepValid(step: number): boolean {
    return this.formGroups()[step]?.valid ?? false;
  }

  getStepStatus(stepIndex: number) {
    return {
      isValid: this.isStepValid(stepIndex),
      isVisited: this.isStepVisited(stepIndex),
      isActive: stepIndex === this.currentStep()
    };
  }
}
