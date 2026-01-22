# Cucumber report historic scenarios

Using cucumber_report.json files, generates an HTML report for historic execution for **each test scenario**. 

It expects report files following cucumber standard version ???

## How to run

1. Gather reports: You need to prepare several `cucumber_report.json` files, you should rename them according to its creation date and time. For instance `cucumber-report-2025-11-06T22-02-37-741Z.json, cucumber-report-2025-12-09T03-26-17-997Z.json, ...`

2. Run the report command by using `npm run report`. By default looks in `reports/` directory for report json files. You can also specify the **output** directory which by default is `cucumber-historic-report.html`.

   - `-p or --path` Specifies the folder where to look for json report files. E.g: `npm run report -p /tmp/reports/json/cucumber_reports`
   - `-o or --output` Specifies the folder where to save the html report. E.g.: `npm run report -o /tmp/historic-reports-by-scenario.html`
   

## Customize

- Modify the `resources/historic_cucumber_report_template.ejs` file, which is an html file using **ejs**

## LICENSE

MIT