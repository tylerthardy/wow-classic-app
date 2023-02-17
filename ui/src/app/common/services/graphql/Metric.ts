// FIXME: Duplicated in api and ui
export const RankingMetricValues = ['dps', 'hps'] as const;
export type RankingMetric = (typeof RankingMetricValues)[number];
