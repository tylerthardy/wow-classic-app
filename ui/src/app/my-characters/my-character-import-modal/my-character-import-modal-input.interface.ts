import { Specialization, WowClass } from 'classic-companion-core';
import { RankingMetric } from '../../common/services/graphql';

export interface IMyCharacterImportModalInput {
  name?: string;
  metric?: RankingMetric;
  wowClass?: WowClass;
  specialization?: Specialization;
}
