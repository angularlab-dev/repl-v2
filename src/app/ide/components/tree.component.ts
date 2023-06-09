import { Component, Input } from '@angular/core';
import getFileType from "../helpers/getFileType";
import {IdeFile} from "../data/state.types";
import {currentFile, openedFiles, theme} from "../data/state";
import isFileOpen from "../helpers/isFileOpen";
import {FolderIconComponent} from "../icons/folder-icon.component";
import {FileIconComponent} from "../icons/file-icon.component";
import {CommonModule} from "@angular/common";

@Component({
  standalone: true,
  imports: [FolderIconComponent, FileIconComponent, CommonModule],
  selector: 'app-tree',
  template: `
    <ul *ngIf="tree" style="padding-left: 20px" class="cursor-pointer">
      <li *ngFor="let dir of directories" (click)="onFileOrDirClick(dir)">
        <folder-icon></folder-icon>
        {{ dir.name }}
        <ng-container>
          <app-tree [tree]="dir['directory']" [path]="dir['path']"></app-tree>
        </ng-container>
      </li>
      <li *ngFor="let file of files" (click)="onFileOrDirClick(file)"
          class="{{isFileOpen(file) ? 'bg-active bg-opacity-40': ''}}"
      >
        <file-icon type="{{getFileType(file.name)}}"></file-icon>
        {{ file.name }}
      </li>
    </ul>
  `,
})
export class TreeComponent {
  @Input() tree: any | undefined;
  @Input() path: string = '.';
  directories: any [] = [];
  files: any[] = [];
  fg = theme().config.foreground;
  bg__selected = theme().config.foreground;
  async openFile(file: IdeFile) {
    const alreadyOpen = openedFiles().find((f: IdeFile) => f.path === file.path);
    if (!alreadyOpen) {
      openedFiles.mutate((val: IdeFile[]) => val.push(file));
    }
    currentFile.set(file);
  }
  async onFileOrDirClick (fileOrDir: any) {
    if (!!fileOrDir['file']) {
      await this.openFile(fileOrDir);
    }
  }
  protected readonly getFileType = getFileType;
  protected readonly currentFile = currentFile;
  protected readonly theme = theme;
  ngOnInit() {
    if (this.tree) {
      Object
        .keys(this.tree)
        .forEach((key) => {
          // @ts-ignore
          const fileOrTree = this.tree[key];
          const fileOrTreeWithName = { ...fileOrTree, name: key, path: `${this.path}/${key}` };
          if (fileOrTree['file']) {
            this.files.push(fileOrTreeWithName);
          } else {
            this.directories.push(fileOrTreeWithName);
          }
          // @ts-ignore
          const sortFunc = ({name: name1}, {name: name2}) => {
            if (name1.toLowerCase() > name2.toLowerCase()) {
              return 1;
            }
            if (name1.toLowerCase() < name2.toLowerCase()) {
              return -1;
            }
            return 0;
          };
          this.files = this.files.sort((sortFunc));
          this.directories = this.directories.sort((sortFunc));
        });
    }
  }

  protected readonly isFileOpen = isFileOpen;
}
