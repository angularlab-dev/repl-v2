import {Component, effect, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {theme, devToolsView, mode, ideState, currentFile, ideTree} from "../ide/data/state";
import lightenColor from "../ide/utils/lightenColor";
import openFile from "../ide/helpers/openFile";
import {isPlatformServer, NgIf} from "@angular/common";
import initWs from "../ide/helpers/initWs";
import {NavigationComponent} from "../ide/components/navigation.component";
import {TreeComponent} from "../ide/components/tree.component";
import {OpenedFilesComponent} from "../ide/components/opened-files.component";


@Component({
  imports: [NavigationComponent, TreeComponent, OpenedFilesComponent, NgIf],
  selector: 'app-home',
  standalone: true,
  template: `
        <app-nav></app-nav>
        <div class="grid grid-cols-12 grid-rows-6 ide bg-gray-200 grid-flow-col {{theme().config.dark ? 'text-gray-200' : 'text-gray-700' }}" >
          <div #treeContainer [style.background-color]="bg__light20" class="row-span-5 col-span-3 border-r border-gray-600 overflow-hidden">
            <app-tree *ngIf="!!ideTree()" [tree]="ideTree()"></app-tree>
          </div>
          <div [style.background-color]="bg__light20" class="row-span-1 col-span-3 border-r p-2 border-gray-600">
            <div class="p-2" [style.background-color]="bg__light10">Settings</div>
          </div>

          <div class="row-span-4 col-span-9 overflow-auto relative" [style.background-color]="bg">
            <div class="sticky top-0 z-10 shadow-md" [style.background-color]="bg__light20">
              <div class="flex">
                <div>
                  <opened-files></opened-files>
                </div>
                <div (click)="mode.set('preview')"
                     class="flex p-2 cursor-pointer ml-auto {{ mode() === 'preview' ? 'border-b-2 border-active shadow-xl': 'border-transparent'}}"
                >
                  preview
                </div>
              </div>
            </div>
            <div [style.display]="mode() === 'preview' ? 'block': 'none'" class="w-full h-full bg-white">
              <iframe #iframe style="height: 95%; width: 100%"></iframe>
            </div>
            <div #editor class="z-10" [style.display]="mode() === 'code' ? 'block': 'none'"></div>
          </div>
          <div class="row-span-2 col-span-9 overflow-hidden" [style.background-color]="bg">
            <div class="shadow-xl" [style.background-color]="bg__light20">
              <div class="container mx-auto">
                <div class="flex items-center justify-start shadow-2xl">
                  <button
                    (click)="devToolsView.set('output')"
                    class="w-24 relative px-1 py-1 focus:outline-none border-b {{devToolsView() === 'output' ? 'border-active' : 'border-transparent'}}">
                    Output
                  </button>
                  <button
                    (click)="devToolsView.set('terminal')"
                    class="w-24 relative px-1 py-1 focus:outline-none border-b {{devToolsView() === 'terminal' ? 'border-active' : 'border-transparent'}}">
                    Terminal
                  </button>
                </div>
              </div>
            </div>

            <div #terminal class="px-1 terminal" [style.display]="devToolsView() === 'terminal' ? 'block': 'none'"></div>
            <div #output class="px-1 terminal" [style.display]="devToolsView() === 'output' ? 'block': 'none'"></div>
          </div>
        </div>
    <div>
      <a href="https://analogjs.org/" target="_blank">
        <img alt="Analog Logo" class="logo analog" src="/analog.svg" />
      </a>
    </div>

    <h2>Analog</h2>

    <h3>The fullstack meta-framework for Angular!</h3>

    <div class="card">
      <button type="button" (click)="increment()">Count {{ count }}</button>
    </div>

    <p class="read-the-docs">
      For guides on how to customize this project, visit the
      <a href="https://analogjs.org" target="_blank">Analog documentation</a>
    </p>
  `,
})
export default class HomeComponent {
  @ViewChild('editor') editorDiv: any;
  @ViewChild('iframe') iframeEl: any;
  @ViewChild('terminal') terminalEl: any;
  @ViewChild('output') outputEl: any;
  @ViewChild('treeContainer') treeContainer: any;
  fg = theme().config.foreground;
  bg = theme().config.background;
  bg__light10 = lightenColor(theme().config.background, 10);
  bg__light20 = lightenColor(theme().config.background, 20);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    effect(() => {
      const { config: {background, foreground}} = theme();
      this.fg = foreground;
      this.bg = background;
      this.bg__light10 = lightenColor(background, 10);
      this.bg__light20 = lightenColor(background, 20);

      const { terminal, output } = ideState();
      if (terminal) {
        terminal.element.querySelector('.xterm-viewport').style.background = background;
        output.element.querySelector('.xterm-viewport').style.background = background;
      }
      const cf = currentFile();
      if (cf) {
        mode.set('code');
        openFile(cf).then();
      }
    }, { allowSignalWrites: true });
  }


  async ngOnInit() {
    if (!isPlatformServer(this.platformId)) {
      fetch('http://localhost:5175/api/v1/tree')
        .then(res => res.json())
        .then(res => {
          // this.tree = res;
          console.log({ tree: res });
          ideTree.set(res);
          initWs({
            editorEl: this.editorDiv.nativeElement,
            iframeEl: this.iframeEl.nativeElement,
            terminalEl: this.terminalEl.nativeElement,
            outputEl: this.outputEl.nativeElement,
            tree: res,
          });
        })
    }
  }

  protected readonly mode = mode;
  protected readonly devToolsView = devToolsView;
  protected readonly theme = theme;
  count = 0;

  increment() {
    this.count++;
  }

  protected readonly ideTree = ideTree;
}
