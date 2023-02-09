import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, map, Observable } from 'rxjs';
import { ItemNote } from './http/common/item-note';
import { CreateSoftresRequest } from './http/create-softres-request.interface';
import { CreateSoftresResponse } from './http/create-softres-response.interface';
import { UpdateSoftresRequest } from './http/update-softres-request.interface';
import { UpdateSoftresResponse } from './http/update-softres-response.interface';
import { CreateSoftresOptions } from './options/create-softres-options.interface';
import { CreateSoftresWithHardReserveOptions } from './options/create-softres-with-hard-reserve-options.interface';
import { HardReserveOptions } from './options/hard-reserve-options.interface';

@Injectable({
  providedIn: 'root'
})
export class SoftresService {
  public exampleSoftres: CreateSoftresResponse = {
    raidId: 'k7sefc',
    edition: 'wotlk',
    instance: 'wotlknaxx10p2',
    discord: true,
    discordId: null,
    discordInvite: null,
    token: 'strike018',
    reserved: [],
    modifications: 0,
    faction: 'Alliance',
    amount: 1,
    lock: false,
    note: '',
    raidDate: null,
    lockRaidDate: false,
    hideReserves: false,
    allowDuplicate: true,
    itemLimit: 0,
    plusModifier: 1,
    plusType: 0,
    restrictByClass: true,
    characterNotes: true,
    itemNotes: [],
    date: '2023-01-30T00:19:58.663Z',
    updated: '2023-01-30T00:19:58.663Z',
    _id: '63d70d2ef13fcda11edd0301'
  };

  private baseUrl: string = 'https://softres.it/api';

  constructor(private http: HttpClient) {}

  public create(options: CreateSoftresOptions): Observable<CreateSoftresResponse> {
    const url: string = `${this.baseUrl}/raid/create`;
    const request: CreateSoftresRequest = options;
    const createResponse: Observable<CreateSoftresResponse> = this.http.post<CreateSoftresResponse>(url, request);
    return createResponse;
    // return of(this.exampleSoftres);
  }

  public createWithHardReserve(options: CreateSoftresWithHardReserveOptions): Observable<CreateSoftresResponse> {
    let result: CreateSoftresResponse;
    return this.create(options as CreateSoftresOptions).pipe(
      concatMap((createResult: CreateSoftresResponse) => {
        const hardReserveOptions: HardReserveOptions = {
          raidId: createResult.raidId,
          token: createResult.token,
          hardReserves: [
            {
              itemId: options.hardReserveItem.id,
              recipient: options.hardReserveRecipient,
              reserved: true
            }
          ]
        };
        result = createResult;
        return this.hardReserve(hardReserveOptions);
      }),
      map((hardReserveResult: boolean) => {
        if (hardReserveResult) {
          result.itemNotes.push({
            hardReserved: true,
            id: options.hardReserveItem.id,
            ignoreClassRestrict: false,
            note: '',
            raider: options.hardReserveRecipient,
            roles: [],
            specs: []
          });
        }
        return result;
      })
    );
  }

  public hardReserve(options: HardReserveOptions): Observable<boolean> {
    const url: string = `${this.baseUrl}/raid/update`;
    const itemNotes: ItemNote[] = options.hardReserves.map((hardReserve) => {
      return {
        hardReserved: hardReserve.reserved,
        id: hardReserve.itemId,
        ignoreClassRestrict: false,
        note: '',
        raider: hardReserve.recipient,
        roles: [],
        specs: []
      };
    });
    const request: UpdateSoftresRequest = {
      token: options.token,
      raid: {
        raidId: options.raidId,
        itemNotes: itemNotes
      }
    };
    const updateResponse: Observable<boolean> = this.http
      .post<UpdateSoftresResponse>(url, request)
      .pipe(map((response) => response.code === 0));
    return updateResponse;
  }
}
