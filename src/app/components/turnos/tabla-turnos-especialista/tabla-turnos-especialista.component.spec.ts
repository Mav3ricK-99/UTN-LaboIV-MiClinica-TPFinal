import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTurnosEspecialistaComponent } from './tabla-turnos-especialista.component';

describe('TablaTurnosEspecialistaComponent', () => {
  let component: TablaTurnosEspecialistaComponent;
  let fixture: ComponentFixture<TablaTurnosEspecialistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaTurnosEspecialistaComponent]
    });
    fixture = TestBed.createComponent(TablaTurnosEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
