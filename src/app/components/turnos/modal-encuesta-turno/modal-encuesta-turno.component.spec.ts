import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEncuestaTurnoComponent } from './modal-encuesta-turno.component';

describe('ModalEncuestaTurnoComponent', () => {
  let component: ModalEncuestaTurnoComponent;
  let fixture: ComponentFixture<ModalEncuestaTurnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEncuestaTurnoComponent]
    });
    fixture = TestBed.createComponent(ModalEncuestaTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
