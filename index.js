/**
 * This is part of cucumber-report-historic-scenarios 
 */

import { getFileDateFromName, getReportFilesList, readFileSync } from './lib/utils.js';
import { getScenariosFromReportJson, groupScenariosByName } from './lib/generator.js';
import path from 'path';
import fs from 'fs';
import { DateTime } from 'luxon';
import ejs from 'ejs';

/**
 * Generates an html report file 
 * @param {*} reportsPath - Directory path where to look for cucumber-report.json files 
 * @param {*} outputFile - File path where to save the html
 * @param {*} templateFile - File path to use as ejs template to generate the report
 * @param {*} maxRecentFiles - Max number of most recent files to read. Default 0 to read all files
 */
function generateHtml(reportsPath = './reports', 
    outputFile = './historic-reports-by-scenario.html',
    templateFile = './resources/historic_cucumber_report_template.ejs',
    maxRecentFiles = 0
) {
    const reportFiles = getReportFilesList(reportsPath);

    const reports = [];
    const dateTimeOfFiles = [];

    for (let i = 0; i < reportFiles.length && i <= maxRecentFiles; i++) {
        const reportFile = reportFiles[i];
        const scenarioReport = getScenariosFromReportJson(path.join(reportsPath, reportFile));
        if (scenarioReport === null) continue;
        reports.push(scenarioReport);
        dateTimeOfFiles.push(getFileDateFromName(reportFile));
    }
    const groupedScenarios = groupScenariosByName(reports.map((report) => report.scenarios));
    // console.log(groupedScenarios);

    const rs = {};
    for (const report of reports) {
        rs[`${report.summary.reportFilename}`] = report.summary;
    }

    const dataToEjs = {
        date: DateTime.now().toUTC().toISO(),
        summary: {
            totalFiles: maxRecentFiles !== 0 ? maxRecentFiles : Object.keys(groupedScenarios).length,
            totalScenarios: Object.keys(groupedScenarios).length,
            minReportDate: dateTimeOfFiles.sort((a, b) => a - b)[0],
            maxReportDate: dateTimeOfFiles.sort((a, b) => a - b)[dateTimeOfFiles.length - 1]
        },
        rs,
        scenarios: groupedScenarios
    };

    // reading ejs template
    const htmlTemplate = readFileSync(templateFile);
    const html = ejs.render(htmlTemplate, dataToEjs);
    console.log(`Generating historic report file per scenarios to ${outputFile}`);
    fs.writeFileSync(outputFile, html);
}

export { generateHtml };
