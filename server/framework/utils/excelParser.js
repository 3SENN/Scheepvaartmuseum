/**
 * Simple helper class for parsing excel sheets to json data. (kinda)
 * The class parses csv files that are generated (save-as in excel) in csv.
 *
 * @Author - Mick Veenman
 */
class excelParser {
    #fs = require('fs');
    #parser = require('csv-parse');

    #path = '../../';

    constructor() {
        this.files = ['elektra', 'gas'];
    }

    readCsv(_file) {
        const file = `${this.#path}${_file}.csv`;
        const data = []

        return new Promise((resolve, reject) => {
            this.#fs.createReadStream(file)
                .pipe(this.#parser.parse({delimiter: ','}))
                .on('data', (r) => {
                    data.push(r);
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }

    csvToJson(csvRows, title) {
        const jsonData = {
            title: title,
            data: []
        };

        // Start at one to skip title
        for (let i = 1; i < csvRows.length; i++) {
            jsonData["data"].push({
                tijdStip: csvRows[i][0],
                value: csvRows[i][1]
            });
        }

        return jsonData
    };

    writeToFile(jsonData, fileName) {
        const path = `${this.#path}${fileName}.json`;

        this.#fs.writeFile(path, JSON.stringify(jsonData), 'utf8',(err) => {
            if(err) console.log(err);

            console.log(`File(${fileName}.json) created Successfully!`)
        });
    }
}

let parser = new excelParser();

const runConversion = async () => {

    for (const file of parser.files) {
        const data = await parser.readCsv(file);
        const json = parser.csvToJson(data, file);

        parser.writeToFile(json, file)
    }
}

runConversion(); // Promise doesnt matter