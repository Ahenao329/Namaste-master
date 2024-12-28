export class ApiError {

  constructor(
    public errorCode: string,
    public message: string,
    public messageTag: string,
    public tags: string[]
  ) { }
}