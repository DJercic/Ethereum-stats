import { autoload, read } from './config';
import * as dbService from './services/db.service';
import * as sync from './sync';

(async function main() {
  autoload({ path: '.env' });
  await dbService.setup();
  const cronSchedule = read('CRON_SCHEDULE', '1 0 * * *');
  sync.run(cronSchedule);
})();
