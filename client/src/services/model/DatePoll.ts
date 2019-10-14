export default class DatePoll {
  constructor(datePollUrl: string, adminDatePollUrl: string) {
    this.datePollUrl = datePollUrl;
    this.adminDatePollUrl = adminDatePollUrl;
  }
  
  public datePollUrl: string | null;
  public adminDatePollUrl: string | null;
}
