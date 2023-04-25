import { defineEventHandler } from 'h3';
import * as fs from "fs";
import * as path from "path";

function directoryToJson(directoryPath: string) {
  const files = fs.readdirSync(directoryPath);

  const result: any = {};

  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isFile()) {
      result[file] = {file: { contents: fs.readFileSync(filePath, 'utf8') }};
    } else if (fileStats.isDirectory()) {
      result[file] = {directory: directoryToJson(filePath)};
    }
  });

  return result;
}

export default defineEventHandler(() => directoryToJson('./content'));
