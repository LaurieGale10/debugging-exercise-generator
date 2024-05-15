import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Extension, Compartment } from '@codemirror/state';
import { python } from "@codemirror/lang-python";

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [],
  templateUrl: './code-viewer.component.html',
  styleUrl: './code-viewer.component.sass'
})
export class CodeViewerComponent implements AfterViewInit, OnChanges {

  @ViewChild('editor') editor: any;

  @Input() codeToDisplay: string | undefined;

  @Input() isReadOnly: boolean | undefined;

  outputText: string = "";

  editorState: EditorState | undefined;
  editorView: EditorView | undefined;
  editorExtensions: Extension = [basicSetup, python()];
  readOnly: Compartment = new Compartment; //Set to a new component to allow dynamic dispatches, which allow readOnly to be changed

  ngAfterViewInit(): void {
    let editorNativeElement = this.editor.nativeElement;
    let state!: EditorState;

    try {
      this.editorState = EditorState.create({
        doc: this.codeToDisplay,
        extensions: [basicSetup,
          python(),
          this.readOnly.of(EditorState.readOnly.of(true))
        ]
      });
    } catch (e) {
      console.log("Haven't installed the right version of CodeMirror. Should be codemirror@6.0.1");
      console.error(e);
    }
    this.editorView = new EditorView({
      state: this.editorState,
      parent: editorNativeElement
    });
  }

  /**
   * Function that is called whenever "any data-bound property of the directive changes"
   * Used to detect a change in snapshotCode, which happens when the currentSnapshotData has changed. If the code has changed at all, then update the display of the CodeMirror editor
   * For more info on this function: https://angular.io/api/core/OnChanges
   */
  ngOnChanges(changes: SimpleChanges): void {
    //Set read only
    if (changes["isReadOnly"])
    this.editorView?.dispatch({
      effects: this.readOnly.reconfigure(EditorState.readOnly.of(changes["isReadOnly"]["currentValue"]))
    })
  }

}
