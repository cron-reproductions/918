const { CronJob } = require('cron');
const sinon = require('sinon');

describe('Cron Reproduction Issue', () => {
    let clock;

    // Clear the clock after each test to avoid side effects
    afterEach(() => {
        clock.restore();
    });

    /**
     * Test to check cron job execution at every Tuesday at 6 PM
     */
    it('should run every Tuesday at exactly 6 PM UTC', () => {
        const callback = jest.fn();

        // Mock the system time to a known Tuesday at 17:59 UTC
        const fixedTuesday = new Date('2024-12-10T17:59:00Z');  // Dec 10, 2024 was a Tuesday.
        clock = sinon.useFakeTimers(fixedTuesday.getTime());

        // Cron job expression: Runs every Tuesday at 18:00 UTC
        const job = new CronJob('0 18 * * 2', callback, null, true, 'UTC');

        // Advance the clock by 1 minute (to 6 PM)
        clock.tick(60 * 1000);

        // Assert that the cron job was called once exactly at 6 PM
        expect(callback).toHaveBeenCalledTimes(1);

        // Advance the clock by a whole week (7 day in milliseconds)
        clock.tick(7 * 24 * 60 * 60 * 1000);

        // Assert that the cron job was called a second time, one week later
        expect(callback).toHaveBeenCalledTimes(2);

        job.stop();
    });

    /**
     * Test the behavior of the cron job when it starts just before Tuesday 6 PM UTC
     */
    it('should not trigger on other days or times incorrectly', () => {
        const callback = jest.fn();

        // Mock the system time to a Monday at noon UTC
        const fixedMonday = new Date('2024-12-09T12:00:00Z');  // Dec 9, 2024 was a Monday.
        clock = sinon.useFakeTimers(fixedMonday.getTime());

        // Cron job expression: Runs every Tuesday at 18:00 UTC
        const job = new CronJob('0 18 * * 2', callback, null, true, 'UTC');

        // Advance the clock by an entire day (One day in milliseconds)
        clock.tick(24 * 60 * 60 * 1000);  // Fast forward to Tuesday at 12 PM

        expect(callback).toHaveBeenCalledTimes(0);  // Job shouldn't fire before 6 PM

        // Advance the clock by another 6 hours to 6 PM
        clock.tick(6 * 60 * 60 * 1000);  // Fast forward to 6 PM Tuesday

        // Check if the job fired
        expect(callback).toHaveBeenCalledTimes(1);

        // Advance the clock another day
        clock.tick(24 * 60 * 60 * 1000);  // Fast forward to Wednesday
        expect(callback).toHaveBeenCalledTimes(1);  // No extra calls

        job.stop();
    });

    /**
     * Test if the cron job respects the system's timezone, and ensures it operates in UTC
     */
    it('should run at the specified time based on UTC regardless of system timezones', () => {
        const callback = jest.fn();

        // System time is set to Tuesday, Dec 10th 2024, 17:59 local time (UTC-5)
        const fixedTimeInLocal = new Date('2024-12-10T22:59:00+05:00');  // 22:59 local in UTC+5
        clock = sinon.useFakeTimers(fixedTimeInLocal.getTime());

        // Cron job expression to run at 18:00 UTC every Tuesday
        const job = new CronJob('0 18 * * 2', callback, null, true, 'UTC');

        // Fast forward by a minute to ensure job is triggered at 18:00 UTC
        clock.tick(60 * 1000);  // Fast forward one minute

        expect(callback).toHaveBeenCalledTimes(1);  // Ensure it ran exactly at 6 PM UTC

        job.stop();
    });

    /**
     * Test if the cron job does not run on days other than Tuesday
     */
    it('should not run on non-Tuesday days', () => {
        const callback = jest.fn();

        // Mock the system time to a Sunday at 18:00 UTC
        const fixedSunday = new Date('2024-12-08T18:00:00Z');  // Dec 8, 2024, was a Sunday.
        clock = sinon.useFakeTimers(fixedSunday.getTime());

        // Cron job expression to run every Tuesday at 6 PM UTC
        const job = new CronJob('0 18 * * 2', callback, null, true, 'UTC');

        // Fast forward one day (One day in milliseconds)
        clock.tick(24 * 60 * 60 * 1000);  // Fast forward to Monday at 6 PM
        expect(callback).toHaveBeenCalledTimes(0);  // Ensure no job ran on Sunday or Monday

        // Fast forward to Tuesday at 6 PM
        clock.tick(24 * 60 * 60 * 1000);
        expect(callback).toHaveBeenCalledTimes(1);  // Only runs on Tuesday

        job.stop();
    });
});
