export const RankingMetricValues = ['dps', 'hps'] as const;
export type RankingMetric = (typeof RankingMetricValues)[number];
