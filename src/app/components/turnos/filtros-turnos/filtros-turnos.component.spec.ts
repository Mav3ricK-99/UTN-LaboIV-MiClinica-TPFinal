import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosTurnosComponent } from './filtros-turnos.component';

describe('FiltrosTurnosComponent', () => {
  let component: FiltrosTurnosComponent;
  let fixture: ComponentFixture<FiltrosTurnosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosTurnosComponent]
    });
    fixture = TestBed.createComponent(FiltrosTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
