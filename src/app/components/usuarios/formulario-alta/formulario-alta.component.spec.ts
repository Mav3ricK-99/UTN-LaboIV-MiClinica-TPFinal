import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAltaComponent } from './formulario-alta.component';

describe('FormularioAltaComponent', () => {
  let component: FormularioAltaComponent;
  let fixture: ComponentFixture<FormularioAltaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioAltaComponent]
    });
    fixture = TestBed.createComponent(FormularioAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
