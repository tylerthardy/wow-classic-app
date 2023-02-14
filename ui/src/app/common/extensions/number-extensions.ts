export {};

declare global {
  interface Math {
    median(array: number[]): number;
  }
}

Math.median = function (array: number[]): number {
  if (array.length === 0) {
    return NaN;
  }
  if (array.length === 1) {
    return array[0];
  }
  const middle: number = Math.floor(array.length / 2);
  const sorted: number[] = array.sort((a, b) => a - b);
  if (sorted.length % 2 === 0) {
    const averageMiddles: number = (sorted[middle - 1] + sorted[middle]) / 2;
    return averageMiddles;
  } else {
    return sorted[middle];
  }
};
