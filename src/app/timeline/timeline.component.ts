import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  events = [
    {
      title: 'Registrado',
      date: '2025-01-15',
      time: '10:30',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed consequatur.',
      icon: 'fas fa-shopping-cart',
    },
    {
      title: 'En Revisión',
      date: '2025-01-15',
      time: '14:00',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed consequatur.',
      icon: 'fas fa-cogs',
    },
    {
      title: 'Finalizado',
      date: '2025-01-15',
      time: '16:15',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed consequatur.',
      icon: 'fas fa-truck',
    },
  ];
}
