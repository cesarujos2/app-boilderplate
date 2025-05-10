import { Component } from '@angular/core';
import { AuthLayout } from "../../layouts/auth/auth.layout";
import { RouterOutlet } from '@angular/router';
import { ThemeSwitchComponent } from "../../components/general/theme-switch/theme-switch.component";

@Component({
  selector: 'auth-page',
  imports: [AuthLayout, RouterOutlet, ThemeSwitchComponent],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export default class AuthPage {

}
