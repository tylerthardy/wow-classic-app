import { RankingMetric, Specialization, WowClass } from 'classic-companion-core';

export interface IMyCharacterImportModalOutput {
  name: string;
  metric: RankingMetric;
  wowClass: WowClass;
  specialization: Specialization;
}
