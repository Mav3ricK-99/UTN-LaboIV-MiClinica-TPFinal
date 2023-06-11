import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTurnosPacienteComponent } from './tabla-turnos-paciente.component';

describe('TablaTurnosPacienteComponent', () => {
  let component: TablaTurnosPacienteComponent;
  let fixture: ComponentFixture<TablaTurnosPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaTurnosPacienteComponent]
    });
    fixture = TestBed.createComponent(TablaTurnosPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
