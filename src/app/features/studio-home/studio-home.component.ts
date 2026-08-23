import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-studio-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './studio-home.component.html',
  styleUrl: './studio-home.component.scss',
})
export class StudioHomeComponent {}
