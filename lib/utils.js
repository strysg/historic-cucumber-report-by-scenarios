/**
 * This is part of cucumber-report-historic-scenarios 
 */

import fs from 'fs';
import path from 'path';

function readFileSync (filepath) {
    const content = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' });
    return content;
}

function readJsonSync (filepath) {
    try {
        const data = readFileSync(filepath);
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (err) {
        console.error('Error reading or parsing JSON file:', err);
        return null;
    }
}

/**
 * Checks if a given tag string is associated to a bug number.
 * E.g.: @bug2812 --> 2812, @test882104 --> null, @documentationBug22131 -> 22131
 * @param {string} tag: bug tag
 * @returns {string} Bug number found
 */
function findBugNumber(tag) {
    const bugsRegex = /@(?<bugType>bug|closedBug|documentationBug|productBug|newBug)(?<number>[0-9]+)/g;
    const matches = bugsRegex.exec(tag);
    if (matches?.groups !== undefined)
        return matches.groups.number;
    return null;
}

/**
 * Checks if a given tag string is associated to a bug type.
 * E.g.: bug2812 --> bug, test882104 --> null, documentationBug22131 -> documentationBug
 * @param {string} tag: bug tag
 * @returns {string} Bug Type found
 */
function findBugType(tag) {
    const bugsRegex = /@(?<bugType>bug|closedBug|documentationBug|productBug|newBug)(?<number>[0-9]+)/g;
    const matches = bugsRegex.exec(tag);
    if (matches?.groups !== undefined)
        return matches.groups.bugType;
    return null;
}

/**
 * Given a directory, lists all files which name has the pattern cucumber-report.json or
 * cucumber-report-{timestamp}.json. E.g.: cucumber-report-2026-01-04T06-13-30-510Z.json 
 * Returns an array of filepath
 * @param {string} reportsDirectory - Directory where to look for report files
 * @param {string} sortDescending - True to return the list sorted by newest first (default), false to return oldest first
 * @returns {string[]} - Array of filepaths
 */
function getReportFilesList (reportsDirectory, sortDescending = true) {
    const regex = /^cucumber-report-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/;
    try {
        const files = fs.readdirSync(reportsDirectory);
        const filepaths = files.filter(file => regex.test(file));
        const sortedFilepaths = filepaths.sort((a, b) => {
            const da = getFileDateFromName(a);
            const db = getFileDateFromName(b);
            if (da < db) return sortDescending? -1 : 1;
            if (da > db) return sortDescending? 1 : -1;
            return 0;
        });
        // always include the cucumber-report.json as first element
        if (files.indexOf('cucumber-report.json') !== -1)
            sortedFilepaths.unshift(files[files.indexOf('cucumber-report.json')])
        return sortedFilepaths;
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

/**
 * Given a file name, extracts the datetime in the name. 
 * Expects format cucumber-report-{timestampWithZ}.json E.g.: cucumber-report-2026-01-04T06-13-30-510Z.json
 * @param {string} filename
 * @returns {string}
 */
function getFileDateFromName(filename) {
    const _fileName = path.basename(filename);
    const regex = /^cucumber-report-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/;
    if (regex.test(_fileName))
        return _fileName.split('cucumber-report-')[1].split('.json')[0];
    return null;
}

export {
    readFileSync,
    readJsonSync,
    findBugNumber,
    findBugType,
    getReportFilesList,
    getFileDateFromName
};