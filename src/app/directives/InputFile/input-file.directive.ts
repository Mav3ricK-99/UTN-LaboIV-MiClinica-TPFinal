import { Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: 'input[type=file][formControlName]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputFileDirective,
      multi: true
    }
  ]
})
export class InputFileDirective implements ControlValueAccessor {
  private onChange: Function;
  @Output() cambioArchivo:EventEmitter<File | null> = new EventEmitter();

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.cambioArchivo.emit(file);
  }

  constructor( private host: ElementRef<HTMLInputElement> ) {
  }

  writeValue( value: null ) {
    // clear file input
    this.host.nativeElement.value = '';
  }

  registerOnChange( fn: Function ) {
    this.onChange = fn;
  }

  registerOnTouched( fn: Function ) {
  }

}