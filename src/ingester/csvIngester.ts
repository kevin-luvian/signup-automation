import fs from 'fs';
import csv from 'csv-parser';
import { RowParser, defaultParser } from '@src/parser/default';

class CsvIngester {
    private csvFilePath: string;

    constructor(csvFilePath: string) {
        this.csvFilePath = csvFilePath;
    }

    async readSync<T = object>(parse: RowParser<T> = defaultParser): Promise<T[]> {
        const results: T[] = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.csvFilePath)
                .pipe(csv())
                .on('data', (data) => results.push(parse(data)))
                .on('end', () => resolve(results))
                .on('error', reject)
        });
    }
}

export default CsvIngester;