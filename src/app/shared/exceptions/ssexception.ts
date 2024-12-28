import { Injectable } from '@angular/core';

export class SSException extends Error {
    public id: number;
    public name: string;
    public message: string;
    public stack: string;
    constructor(message: string) {
        super(message);
        this.id = -1;
        this.name = 'SSException';
        this.message = message;
        this.stack = (<any>new Error()).stack;
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SSException.prototype);
    }

    fillParams(id:number){
        this.id = id;
    }

    toString() {
        return this.name + ': ' + this.message;
    }
}

