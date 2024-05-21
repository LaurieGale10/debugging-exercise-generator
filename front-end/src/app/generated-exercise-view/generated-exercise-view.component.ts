import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CodeViewerComponent } from '../code-viewer/code-viewer.component';
import {ClipboardModule} from '@angular/cdk/clipboard';

import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-generated-exercise-view',
  standalone: true,
  imports: [CommonModule, CodeViewerComponent, ClipboardModule, MatButtonModule, MatExpansionModule, MatIconModule],
  templateUrl: './generated-exercise-view.component.html',
  styleUrl: './generated-exercise-view.component.sass'
})
export class GeneratedExerciseViewComponent {

  constructor(private _snackBar: MatSnackBar) {}

  @Input() incorrectProgram: string | null = null;

  @Input() errorExplanations: Array<string> = [];

  @Input() fullResponse: string | null = null;

  snackBarDisplayDuration: number = 2; //Time to display snackbar component for in seconds

  /**
   * Method to open "Copied to clipboard" snackbar message for snack
   */
  openSnackBar() {
    this._snackBar.open("Copied to clipboard");
  }

}
