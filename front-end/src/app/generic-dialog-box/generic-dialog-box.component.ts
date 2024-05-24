import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import {MatButton, MatButtonModule} from '@angular/material/button';

export interface DialogData {
  title: string,
  content: string
}

@Component({
  selector: 'app-generic-dialog-box',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
  templateUrl: './generic-dialog-box.component.html',
  styleUrl: './generic-dialog-box.component.sass'
})

export class GenericDialogBoxComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
