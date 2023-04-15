import { upsertTransfer } from './upsert-transfer-table';

console.log('hello world');

const sourceTableName: string = '';
const targetTableName: string = '';

(async () => {
  await upsertTransfer(sourceTableName, targetTableName);
  // await reindexTable(sourceTableName, targetTableName);
})();
