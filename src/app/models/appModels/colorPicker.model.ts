import { JsonPipe } from "@angular/common";

export class ColorPicker {
    // isRange: boolean = false;
    singleColor: { jsColor: string };
    // dateRange: any = null;

    constructor(color: string) {
        this.singleColor = { jsColor: color };
    }}
