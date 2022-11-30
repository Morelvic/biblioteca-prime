import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  items: MenuItem[] = [
    {
      label: "Biblioteca",
      icon: PrimeIcons.BOOK,
      items: [
        {
          label: "Libros",
          icon: PrimeIcons.BOOKMARK,
          routerLink: ['libros']
        },
        {
          label: "Autores",
          icon: PrimeIcons.USERS,
          routerLink: ['autores']
        }
      ]
    }
  ];



  constructor() { }

  ngOnInit(): void {
  }

}
