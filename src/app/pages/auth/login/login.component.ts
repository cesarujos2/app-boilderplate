import { Component, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField, MatLabel,
    MatSelect, MatOption,
    MatInput,
    MatButton,
    MatIcon,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  personTypes = signal([{
    value: 'N',
    label: 'Natural'
  }, {
    value: 'J',
    label: 'Juridica'
  }])

  documentTypes = signal([{
    value: 'DNI',
    label: 'Documento Nacional de Identidad'
  }, {
    value: 'CE',
    label: 'Carnet de Extranjería'
  }, {
    value: 'PASS',
    label: 'Pasaporte'
  }])
}
