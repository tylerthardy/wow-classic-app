export interface JsonRaidPlayer {
  name: string;
  roles: [number, number, number];
  // TODO: Enum to represent these on both sides
  class: string;
}
