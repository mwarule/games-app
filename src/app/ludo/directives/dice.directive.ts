import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector:'[dice]'
})

export class DiceDirective{
  constructor(public viewContainerRef: ViewContainerRef){

  }
}
