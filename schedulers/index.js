const { scheduleJob } = require('node-schedule');
const { fetchRatesJob } = require('./fetchRatesJob')

const runEveryFiveMinutes = '0 */5 * * * *';
const runEveryDay = '0 0 0 * * *';

const job1 = scheduleJob(runEveryFiveMinutes, fetchRatesJob)

const job2 = scheduleJob(runEveryDay, () => {
    console.log('Hourly Job running at - ', new Date());
})
