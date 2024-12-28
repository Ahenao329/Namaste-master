export class MyDatePicker {
    isRange: boolean = false;
    singleDate: { jsDate: Date };
    dateRange: any = null;

    constructor(date: Date) {
        this.singleDate = { jsDate: date };
    }
}

