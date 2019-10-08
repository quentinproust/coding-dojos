import Subject from './Subject';
import DatePoll from './DatePoll';

export default class Dojo {
  public id: string | null;
  public label: string;
  public status: string;
  public subject: Subject | null;;
  public location: string | null;
  public date: string | null;
  public poll: DatePoll | null;
}
