export class Ad {
  constructor(
    public id: string,
    public photos: any,
    public dateFrom: string,
    public dateTo: string,
    public timeFrom: string,
    public timeTo: string,
    public pickUpAddress: string
  ) {}
}
