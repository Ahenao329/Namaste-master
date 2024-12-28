import { Injector, InjectionToken, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dynamic' })
export class DynamicPipe implements PipeTransform {
  constructor(private injector: Injector) { }

  transform(value: any, pipe: any, args: string): any {
    //console.log("DynamicPipe", value, pipe, args);

    let pipeArgs = null;

    if (args) {
      if (args.indexOf(":")> -1) {
        if (args.indexOf("ss") > -1 || args.indexOf("mm") > -1 || args.indexOf("HH") > -1  || args.indexOf("h") > -1){
          pipeArgs = [args]; //Formato de fecha
        }else{
          pipeArgs = args.split(":");
        }
      } else {
        pipeArgs = [args];
      }
  
      return pipe.transform(value, ...pipeArgs);
    } else {
      return pipe.transform(value);
    }
  }
}