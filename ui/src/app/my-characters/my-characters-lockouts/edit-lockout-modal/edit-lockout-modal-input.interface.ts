export interface IEditLockoutModalInput {
  scheduledDay?: string;
  scheduledTime?: string;
  notes?: string;
  needsToRun: boolean;
  completed: boolean;
}
