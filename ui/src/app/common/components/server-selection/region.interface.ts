import { Server } from './server.interface';

export interface Region {
  id: number;
  compactName: string;
  name: string;
  slug: string;
  servers: Server[];
}
