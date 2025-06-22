import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitacStatus } from '../../models/fta';

/**
 * Componente genérico para mostrar chips/badges
 * Reutilizable en todo el dashboard
 */
@Component({
    selector: 'app-custom-chip',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span 
      class="inline-flex items-center rounded-full text-sm cursor-pointer transition-all duration-200 hover:shadow-md select-none relative text-center"
      [ngClass]="chipClass + ' ' + chipSizeClass"
      style="isolation: isolate; contain: layout style paint;">
      <ng-content></ng-content>
    </span>
  `
})
export class CustomChipComponent {
    variant = input<FitacStatus | 'DEFAULT'>('DEFAULT');
    size = input<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');

    get chipClass(): string {
        const variants: { [key in FitacStatus | 'DEFAULT']: string } = {
            'VALIDATED': 'bg-[#10b981] text-white hover:brightness-110',       // Verde esmeralda (primary)
            'FOR_SIGNATURE': 'bg-[#0ea5e9] text-white hover:brightness-110',   // Azul brillante (secondary)
            'PRESENTED': 'bg-[#6b7280] text-white hover:brightness-110',       // Gris medio (neutral variant)
            'UNDER_REVIEW': 'bg-[#4b5563] text-white hover:brightness-110',    // Gris oscuro (neutral)
            'RESOLVED': 'bg-[#047857] text-white hover:brightness-110',        // Verde profundo (tono oscuro de primary)
            'DEFAULT': 'bg-[#9ca3af] text-white hover:brightness-110'          // Gris claro (opcional extra para neutro)
        };

        return variants[this.variant()];
    }

    get chipSizeClass(): string {
        const sizes: { [key in 'SMALL' | 'MEDIUM' | 'LARGE']: string } = {
            'SMALL': 'text-xs px-2.5 py-1',
            'MEDIUM': 'text-sm px-3 py-1.5',
            'LARGE': 'text-base px-4 py-2'
        };
        return sizes[this.size()];
    }
}
