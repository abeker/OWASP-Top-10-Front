export class User {
  constructor(
    public id: string,
    public username: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    public userRole: string
  ) {}

  get token() {
    if(!this._tokenExpirationDate || new Date > this._tokenExpirationDate){
      return null;
    }
    return this._token;
  }
}
