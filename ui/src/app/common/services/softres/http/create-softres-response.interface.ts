import { Softres } from './common/softres.interface';

export interface CreateSoftresResponse extends Softres {
  token: string;
}
