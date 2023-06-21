import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  es: {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    weekLabel: 'sem',
  },
};

// Define custom service providing the months and weekdays translations
@Injectable()
export class DatepickerService extends NgbDatepickerI18n {
  constructor() {
    super();
  }

  getWeekdayLabel(weekday: number): string {
    return I18N_VALUES['es'].weekdays[weekday - 1];
  }

  override getWeekLabel(): string {
    return I18N_VALUES['es'].weekLabel;
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES['es'].months[month - 1];
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
