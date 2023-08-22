import { INitImportLockout } from './nit-import-lockout.interface';

export interface INitImport {
  version: string;
  lockouts: { [characterName: string]: INitImportLockout[] };
}
