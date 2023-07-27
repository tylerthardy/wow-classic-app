import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Specializations, WowClass } from 'classic-companion-core';
import { IServerParseData } from './server-parse-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(http: HttpClient) {}

  dater: IServerParseData = {
    raids: ['ToGC25', 'Uld25', 'ToGC10', 'Uld10'],
    names: ['warterter', 'sherterter', 'sperticus'],
    classSpecs: [
      [WowClass.WARRIOR, Specializations.ARMS, Specializations.FURY] // 1 = class, 18 = spec 1, 19 = spec 2
    ],
    parses: [
      [[94.2], [97.3], [99.1], [94.1]],
      [[94.2], [97.3], [99.1], [94.1]],
      [[94.2], [97.3], [99.1], [94.1]],
      [[94.2], [97.3], [99.1], [94.1]]
    ]
  };

  public getServerFactionParses(server: string, faction: string): IServerParseData {}
}
