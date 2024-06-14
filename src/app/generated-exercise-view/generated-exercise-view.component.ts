import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CodeViewerComponent } from '../code-viewer/code-viewer.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {FormsModule} from '@angular/forms';
import * as jsdiff from 'diff';

import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-generated-exercise-view',
  standalone: true,
  imports: [CommonModule, CodeViewerComponent, ClipboardModule, FormsModule, MatButtonModule, MatExpansionModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './generated-exercise-view.component.html',
  styleUrl: './generated-exercise-view.component.sass'
})
export class GeneratedExerciseViewComponent {

  constructor(private _snackBar: MatSnackBar) {}

  @Input() incorrectProgram: string | null = null;

  @Input() correctProgram: string | null = null;

  @Input() errorExplanations: Array<string> = [];

  @Input() fullResponse: string | null = null;

  @Input() regenerationNumber: number;

  snackBarDisplayDuration: number = 2; //Time to display snackbar component for in seconds

  showCorrectProgramComparison: boolean = false; //Whether to show comparison with correctProgram

  showDiffs: boolean = true; //Whether to display the static correctProgram or diffs between correctProgram and incorrectProgram

  /**
   * Method to open "Copied to clipboard" snackbar message for snack
   */
  openSnackBar(): void {
    this._snackBar.open("Copied to clipboard","", {
      duration: 1000,
      panelClass: ["custom-snack-bar"]
    });
  }

  diff(oldString: string, newString: string): string {
    let diff = jsdiff.diffLines(oldString, newString);
    let outputString = "";
    //Iterates through lines of diff string, grouped into added, removed, and unchanged and adds them to a new outputString. +'s and -'s are appended to added and removed lines respectively
    diff.forEach(part => {
      const lines: string[] = part.value.split('\n').filter(line => line.trim() !== '');
      if (part.added) {
        lines.forEach(line => {
          outputString += `+ ${line}\n`;
        });
      } else if (part.removed) {
        lines.forEach(line => {
          outputString += `- ${line}\n`;
        });
      }
      else {
        outputString += part.value;
      }
    });
    return outputString;
  }

}