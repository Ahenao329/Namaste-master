import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class SharedPipesModule { }


//Separadores de miles y decimal, según la localización
@Pipe({
  name: 'separadoresNumero'
})
export class SeparadoresNumeroPipe implements PipeTransform {

  transform(value: number | string, locale?: string, numDecimales?: number): string {
    let numDec: number = 0;
    if (numDecimales)
      numDec = numDecimales
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: numDec
    }).format(Number(value));
  }

}

