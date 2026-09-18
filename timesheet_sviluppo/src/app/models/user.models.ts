export class User {
  constructor(
    public username: string,
    public _token: string
  ) {}

  get token() {
    return this._token;
  }
}