export interface IEditLockoutModalOutput {
  scheduledDay?: string;
  scheduledTime?: string;
  notes?: string;
  needsToRun: boolean;
  completed: boolean;
}
