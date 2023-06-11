import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFinalizarTurnoComponent } from './modal-finalizar-turno.component';

describe('ModalFinalizarTurnoComponent', () => {
  let component: ModalFinalizarTurnoComponent;
  let fixture: ComponentFixture<ModalFinalizarTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalFinalizarTurnoComponent]
    });
    fixture = TestBed.createComponent(ModalFinalizarTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
