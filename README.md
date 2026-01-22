# Cucumber report historic scenarios

Using cucumber_report.json files, generates an HTML report for historic execution for **each test scenario**. 

It expects report files following cucumber standard version ???

## How to run

### Option 1 using as a library

Include the generator to your file:

```js
import { generateHtml } from 'package-name';

// In order to generate reports, only need to call generateHtml passing arguments

generateHtml(reportsPath, outputFile, templateFile, maxRecent);
// TODO: complete
```

### Option 2 using cli

1. Gather reports: You need to prepare several `cucumber_report.json` files, you should rename them according to its creation date and time using format *ISO Timestamp*. For instance `cucumber-report-2025-11-06T22-02-37-741Z.json, cucumber-report-2025-12-09T03-26-17-997Z.json, ...`

2. Run the report command by using `npm run test:generate`. By default looks in `reports/` directory for report json files. You can also specify the **output** directory which by default is `historic-reports-by-scenario.html`.

```
Options:
  -p, --path <dir>      Directory where to look for report-json files (default: ./reports)
  -o, --output <dir>    File and path where to save the html report (default historic-reports-by-scenario.html)
  -t, --template <dir>  Ejs template file to render html (default historic_cucumber_report_template.ejs)
  -m, --max-recent <n>  Max number of recent files to include in the report (default all files)
``` 
   
Example: `npm run test:generate -- --path /home/project/reports/json/historic --output /tmp/out.html --template /home/project/resources/historic_cucumber_report_template.ejs --max-recent 10`


## Customize

- Modify the `resources/historic_cucumber_report_template.ejs` file, which is an html file using **ejs**

## LICENSE

MIT