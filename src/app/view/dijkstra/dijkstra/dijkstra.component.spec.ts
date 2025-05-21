import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DijkstraComponent } from './dijkstra.component';

describe('DijkstraComponent', () => {
  let component: DijkstraComponent;
  let fixture: ComponentFixture<DijkstraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DijkstraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DijkstraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
