import { ISpecializationData, WowClass } from 'classic-companion-core';

export interface IServerParseData {
  raids: string[];
  names: string[];
  classSpecs: (WowClass | ISpecializationData)[][];
  parses: number[][][];
}
