import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCalificarAtencionComponent } from './modal-calificar-atencion.component';

describe('ModalCalificarAtencionComponent', () => {
  let component: ModalCalificarAtencionComponent;
  let fixture: ComponentFixture<ModalCalificarAtencionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCalificarAtencionComponent]
    });
    fixture = TestBed.createComponent(ModalCalificarAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
