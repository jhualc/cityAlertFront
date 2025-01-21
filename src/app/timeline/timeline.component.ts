import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  events = [
    { title: 'Evento 1', description: 'Descripción del evento 1', date: new Date() },
    { title: 'Evento 2', description: 'Descripción del evento 2', date: new Date('2025-01-01') },
    { title: 'Evento 3', description: 'Descripción del evento 3', date: new Date('2025-01-10') }
  ];
}
