import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'snack-bar-custom-component-snack',
    templateUrl: 'snack-bar-custom.template.html',  
    styleUrls:['snack-bar-custom.component.scss']
  })
  export class SnackBarCustomComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar) {
  }
  }