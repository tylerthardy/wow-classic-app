import { Specialization, WowClass } from 'classic-companion-core';
import { RankingMetric } from '../../common/services/graphql';

export interface IMyCharacterImportModalOutput {
  name: string;
  metric: RankingMetric;
  wowClass: WowClass;
  specialization: Specialization;
}
