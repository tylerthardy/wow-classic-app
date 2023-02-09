import { ItemNote } from './item-note';

export interface Softres {
  token?: string; //'bog880'
  raidId: string; //'osbpm7'
  edition: string; //'wotlk'
  instance: string; //'wotlknaxx10p2'
  discord: boolean; //boolean
  discordId: any; //unknown
  discordInvite: any; //unknown
  reserved: any[]; //unknown
  modifications: number; //0
  faction: string; //'Alliance'
  amount: number; //1
  lock: boolean; //boolean
  note: string; //''
  raidDate: any; //unknown
  lockRaidDate: boolean; //boolean
  hideReserves: boolean; //boolean
  allowDuplicate: boolean; //boolean
  itemLimit: number; //0
  plusModifier: number; //1
  plusType: number; //0
  restrictByClass: boolean; //boolean
  characterNotes: boolean; //boolean
  itemNotes: ItemNote[]; //unknown
  date: string; //'2023-01-26T23:48:22.992Z';//date
  updated: string; //'2023-01-26T23:48:22.992Z';
  _id: string; //abc123
}
