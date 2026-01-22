/**
 * This is part of cucumber-report-historic-scenarios 
 */
import 'ejs';
import { DateTime } from 'luxon';
import path from 'path';
import {     
    readJsonSync,
    getFileDateFromName
} from './utils.js';

/**
 * Given a jsonPath of a cucumber report file, extracts the desired fields for each scenario,
 * then returns a dictionary with each scenario results and a summary for the report file.
 * @param {*} jsonPath 
 * @returns {Object} Disctionary of objects with scenario results in format:
 * { 
 *   summary: {
 *      total: totalScenarios,
 *      passed: <passedCount>,
 *      failed: <failedCount>,
 *      skipped: <skippedCount>,
 *      reportFilename: <reportFileName>,
 *   },
 *   scenarios: {
*       '<scenarioName>': {
            name: '<scenarioName>',
            dateTime: '<dateInFormat dd-mm-yyy hh:mm:ss UTC ISO Timestamp>',
            id: '<id>',
            status: '<status>',
            tags: [<tag1>, <tag2>, ...],
            steps: [{
                name: <stepName>,
                status: <stepStatus>,
                duration: <stepDuration>,
                error: '<errorDetail>',
                location: '<stepLocation>'
            },..]
        }
    }
 */
function getScenariosFromReportJson(jsonPath) {
    const jsonContent = readJsonSync(jsonPath);
    const dateTime = getFileDateFromName(jsonPath);
    const scenarios = {};
    const summary = {
        reportFilename: path.basename(jsonPath),
        total: 0, passed: 0, failed: 0, skipped: 0
    };

    for (const feature of jsonContent) {
        const commonTags = feature['tags'].map(tag => tag.name);

        for (const scenario of feature.elements) {
            if (scenario.keyword !== 'Scenario') continue;
            const scenarioContent = {};
            scenarioContent.dateTime = dateTime;
            scenarioContent.id = scenario.id;
            scenarioContent.name = scenario.name;
            scenarioContent.tags = [...commonTags, ...scenario.tags.map(tag => tag.name)];
            scenarioContent.steps = [];

            let i = 0;
            for (const step of scenario.steps) {
                if (step.keyword === 'After' || step.keyword === 'Before')
                    continue;
                // scenario status
                i = i + 1;
                if (step.result !== undefined && scenarioContent.status === undefined) {
                    const status = step.result.status.toLowerCase();
                    if (status === 'skipped' && i === 0) scenarioContent.status = 'skipped';
                    if (status === 'failed') scenarioContent.status = 'failed';
                }
                // rest of the fields
                scenarioContent.steps.push({
                    name: `${step.keyword ? step.keyword : '' } ${step.name}`,
                    status: step.result ? step.result.status : '',
                    duration: step.result.duration ? step.result.duration : 0,
                    error: step.result['error_message'] ? step.result['error_message'] : '',
                    location: step.match? step.matchlocation : '',
                });
            }
            // if all steps are different from failed or skipped then the scenario passed
            if (scenarioContent.status === undefined) scenarioContent.status = 'passed';

            summary[scenarioContent.status] += 1;
            summary['total'] += 1;
            scenarios[scenarioContent.name] = scenarioContent;
        }
    }

    return {
        summary,
        scenarios
    }
};

/**
 * Receives an array of scenario objects and groups them by scenario name returning an object
 * of basic stats per scenario and all executions.
 * @param {Object[]} scenarios - Array of scenario objects of different executions
 * @returns {Object} - Object in format:
 * 
 * {'<scenarioName>': {
        name: '<scenarioName>',
        numberOfExecutions: <numberOfTotalExecutions>,
        failures: <numberOfFailures>,
        passed: <numberOfPasses>,
        skipped: <numberOfSkipped>,
        executions: [{
            dateTime: '<dateInFormat dd-mm-yyy hh:mm:ss>',
            id: '<id>',
            status: '<status>',
            tags: [<tag1>, <tag2>, ...],
            steps: [{
                name: <stepName>,
                status: <stepStatus>,
                duration: <stepDuration>,
                error: '<errorDetail>',
                location: '<stepLocation>'
            }, ...]
        }, ...]
        
    }, ... }
 */
function groupScenariosByName(scenarios) {
    const scenariosGrouped = {};
    for (const report of scenarios) {
        for (const scenarioName of Object.keys(report)) {
            if (scenariosGrouped[scenarioName] === undefined) {
                scenariosGrouped[scenarioName] = {
                    name: scenarioName,
                    numberOfExecutions: 1,
                    failures: 0,
                    passed: 0,
                    skipped: 0,
                    executions: []
                }
            }
            scenariosGrouped[scenarioName].executions.push(report[scenarioName]);
            scenariosGrouped[scenarioName].failures += report[scenarioName].status === 'failed' ? 1 : 0
            scenariosGrouped[scenarioName].skipped += report[scenarioName].status === 'skipped' ? 1 : 0
            scenariosGrouped[scenarioName].passed += report[scenarioName].status === 'passed' ? 1 : 0
            scenariosGrouped[scenarioName].numberOfExecutions = scenariosGrouped[scenarioName].executions.length;
        }
    }
    return scenariosGrouped;
}

export { getScenariosFromReportJson, groupScenariosByName };