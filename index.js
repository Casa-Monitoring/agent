const os = require("os");
const process = require("process");
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

const storageName       = process.env.MONITORING_STORAGE_NAME;
const storageKey        = process.env.MONITORING_STORAGE_KEY;
const samplingInterval  = process.env.MONITORING_INTERVAL       || 5000; // 5 seconds
const tableName         = process.env.MONITORING_TABLE_NAME     || "MonitoringMetrics";
const deviceName        = os.hostname();

const ticksInMillisecond    = 10000;
const ticksEpoch            = 621355968000000000;
const ticksMax              = 662352768000000000; // 2100-01-01 00:00 UTC

function logInfo(message) {
    console.log(message);
}

function logError(message) {
    console.error(message);
}

logInfo("prepearing agent");

const tableClient = new TableClient(
    `https://${storageName}.table.core.windows.net`,
    tableName,
    new AzureNamedKeyCredential(storageName, storageKey)
);

tableClient.createTable()
.then(() => {
    logInfo("agent is ready");

    function submitMeasurements() {
        let date = new Date();
    
        let key = (ticksMax - ((date.getTime() * ticksInMillisecond) + ticksEpoch)).toString();
    
        let metric = {
            partitionKey:   deviceName,
            rowKey:         key,
    
            tYear:      date.getUTCFullYear(),
            tMonth:     date.getUTCMonth() + 1,
            tDay:       date.getUTCDate(),
            tHour:      date.getUTCHours(),
            tMinute:    date.getUTCMinutes(),
            tSecond:    date.getUTCSeconds(),
    
            mIsPower:       true,
            mIsInternet:    true
        };
    
        tableClient.createEntity(metric)
        .then((result) => {
            logInfo(result);
        })
        .catch((errMessage) => {
            logError(errMessage);
        });
    }
    
    setInterval(submitMeasurements, samplingInterval);
})
.catch((errMessage) => {
    logError(errMessage);
});
