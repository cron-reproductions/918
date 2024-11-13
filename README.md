# Cron Issue Reproduction for [#918](https://github.com/kelektiv/node-cron/issues/918)

This repository is a minimal reproduction for the issue described in [kelektiv/node-cron#918](https://github.com/kelektiv/node-cron/issues/918).

## Steps to Reproduce

1. Clone the repository
   ```bash
   git clone https://github.com/cron-reproductions/918.git
   ```

2. Navigate to the project directory and install dependencies:
   ```bash
   cd 918
   npm install
   ```

3. Start the cron job:
   ```bash
   npm start
   ```

   The cron job is configured to log a message to the console at 6 PM every Tuesday in UTC.

4. Modify the `index.js` file to change the schedule or logging behavior if necessary to replicate the issue.

   Example: Changing the cron job for testing purposes to execute every minute.
   ```javascript
   '* * * * *'
   ```

## Running the Test Suite

This repository also includes a comprehensive test suite to help identify and reproduce any issues with the cron job.

### Running the Tests

1. Run the tests using the following command:
    ```bash
    npm test
    ```

The test suite mocks the system's clock and simulates different scenarios, such as:

- Correct execution of the cron job at 6 PM every Tuesday (UTC).
- Delays or incorrect job execution on non-Tuesday days.
- Ensuring the cron job respects time zones, especially `UTC`.
- Logging additional debugging information to help diagnose the issue.

These tests will help systematically verify the behavior of the cron job over multiple simulated days, meaning you won’t need to manually modify the system date/time to observe if the problem occurs.

### Example Test Output

After running the tests, you should see output similar to this:

```bash
PASS  ./cron.spec.js
✓ should run every Tuesday at exactly 6 PM UTC (XXXXX ms)
✓ should not trigger on other days or times incorrectly (XXXXX ms)
✓ should run at the specified time based on UTC regardless of system timezones (XXXXX ms)
✓ should not run on non-Tuesday days (XXXXX ms)
✓ should log useful information when the job misfires (XXXXX ms)
...
```

If you notice some tests failing, it’s most likely that they are tied to the issue described in [node-cron Issue #918](https://github.com/kelektiv/node-cron/issues/918).

## Reproduced Issue

This repository is reproducing an issue from the [`node-cron`](https://www.npmjs.com/package/cron) package:

- [Issue #918: CronJob not firing at expected times](https://github.com/kelektiv/node-cron/issues/918)

The issue describes unexpected behavior in certain situations where the cron job runs at the wrong times or on incorrect days. This repository serves as a minimal repro to help demonstrate the specific problem that has been reported. If you encounter similar behavior, follow the steps above to replicate this issue in your environment. You can also refer to the linked issue for further details and possible updates.

## Expected Behavior

The cron job should execute every Tuesday at 6 PM UTC.

## Actual Behavior

There has been irregular behavior with the cron job firing at unexpected times, such as Sundays or Mondays, and at various wrong times (e.g., 22:54 or 20:32). For the full discussion and potential fixes, see [Issue #918](https://github.com/kelektiv/node-cron/issues/918).

## Debugging and Troubleshooting

If you face irregular cron job timing behavior, ensure that:
- Your system timezone is set correctly.
- You use the appropriate date and time handling technique (using `UTC` if necessary).
- Logs and execution times are inspected carefully to detect any drift or schedule misalignments.

For testing purposes, you can modify the cron expression to run every minute:
```javascript
'* * * * *'
```

This allows you to quickly verify whether the cron job is firing on schedule.

For more advanced troubleshooting steps and debugging suggestions, see the test suite included in the project and inspect the logging statements.
```
