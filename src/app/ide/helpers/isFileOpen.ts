import {IdeFile} from "../data/state.types";
import {currentFile, mode} from "../data/state";

export default function isFileOpen(file: IdeFile) {
  return mode() === 'code' && currentFile()?.path === file.path;
}
