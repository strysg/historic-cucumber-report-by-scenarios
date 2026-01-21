/**
 * This is part of cucumber-report-historic-scenarios 
 */

import { getReportFilesList } from './lib/utils.js';
import { getScenariosFromReportJson, groupScenariosByName } from './lib/generator.js';
import path from 'path';


// const { getReportFilesList } = require('./lib/utils');
// const { getScenariosFromReportJson, groupScenariosByName } = require('./lib/generator');

/**
 * Generates an html report file 
 * @param {*} reportsPath 
 * @param {*} outputFile 
 */
function generateHtml(reportsPath = './reports', outputFile = './historic-reports-by-scenario.html') {
    const reportFiles = getReportFilesList(reportsPath);
    console.log('----- report files');
    console.log(reportFiles);

    const reports = [];
    for (const reportFile of reportFiles) {
        const scenarioReport = getScenariosFromReportJson(path.join(reportsPath, reportFile));
        reports.push(scenarioReport);
    }
    const groupedScenarios = groupScenariosByName(reports);
    console.log(groupedScenarios);

    // TODO: read ejs, replace and save file.
}

export { generateHtml };