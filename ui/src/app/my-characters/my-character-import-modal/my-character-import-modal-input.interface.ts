import { RankingMetric, Specialization, WowClass } from 'classic-companion-core';

export interface IMyCharacterImportModalInput {
  name?: string;
  metric?: RankingMetric;
  wowClass?: WowClass;
  specialization?: Specialization;
}
