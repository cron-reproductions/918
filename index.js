const cron = require('cron');

// This cron job should run on 6 PM every Tuesday (UTC time).
const scheduledJob = new cron.CronJob(
    '0 18 * * 2',  // 6 PM on Tuesdays in cron format
    () => {
        console.log('Cron job executed!', new Date());
    },
    null,          // OnComplete function
    true,          // Start immediately
    'UTC'          // Time zone
);

console.log("Cron job scheduled, waiting for execution...");
