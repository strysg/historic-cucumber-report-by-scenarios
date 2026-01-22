/**
 * This is part of cucumber-report-historic-scenarios 
 */

import { generateHtml } from './index.js';
import { program } from 'commander';

function main () {
    /*
    Defining cli options
    */
    program
        .name('Historic Cucumber Scenario Report')
        .description(`
        Generates an HTML file combining multiple cucumber-report.json files grouped by scenario.
        Reads a path with report files in format: cucumber-report-<UTC ISO timestap>.json
        and generates an html output.
        `)
        .version('1.0.0')
        .option('-p, --path <dir>', 'Directory where to look for report-json files (default: ./reports)')
        .option('-o, --output <dir>', 'File and path where to save the html report (default historic-reports-by-scenario.html)')
        .option('-t, --template <dir>', 'Ejs template file to render html (default historic_cucumber_report_template.ejs)')
        .option('-m, --max-recent <n>', 'Max number of recent files to include in the report (default all files)', parseInt);

    program.parse();
    
    const options = program.opts();
    console.log(options);

    const reportsPath = options.path || './reports';
    const outputFile = options.output || 'historic-reports-by-scenario.html';
    const templateFile = options.template || './resources/historic_cucumber_report_template.ejs';
    const maxRecent = options.maxRecent || 0;

    generateHtml(reportsPath, outputFile, templateFile, maxRecent);
}

main();