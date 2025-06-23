import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FitacStatus } from '../../pages/datasheet/models/datasheet.interface';

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
            'VALIDATED': 'bg-[#10b981] text-white hover:brightness-110',       // Verde esmeralda vibrante: éxito
            'FOR_SIGNATURE': 'bg-[#6366f1] text-white hover:brightness-110',   // Azul violeta moderno: acción pendiente
            'PRESENTED': 'bg-[#f59e0b] text-white hover:brightness-110',       // Ámbar: entregado, en espera
            'UNDER_REVIEW': 'bg-[#f97316] text-white hover:brightness-110',    // Naranja fuerte: en revisión
            'RESOLVED': 'bg-[#059669] text-white hover:brightness-110',        // Verde más profundo: completado
            'DEFAULT': 'bg-[#e5e7eb] text-gray-800 hover:brightness-105'       // Gris muy claro: estado por defecto / desconocido
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
