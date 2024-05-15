import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Validators } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { CodeViewerComponent } from "./code-viewer/code-viewer.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass',
    imports: [RouterOutlet, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, CodeViewerComponent]
})
export class AppComponent {
  title = 'front-end';

  constructor(private formBuilder: FormBuilder) {}

  sampleProgram: string = "print('Hello world');"
  exerciseGenerated: boolean = false;

  //Using FormBuilder due to less amount of boiler plate code (also discussed here: https://stackoverflow.com/questions/56015702/angular-form-builder-vs-form-control-and-form-group)
  programDetailsForm = this.formBuilder.group({ //Creates a group of FormControls
    programDescription: ['', Validators.required],
    correctProgram: ['', Validators.required],
    numberSyntaxErrors: ['', Validators.required],
    numberRuntimeErrors: ['', Validators.required],
    numberLogicalErrors: ['', Validators.required]
  }, {
    validators: [AppComponent.numberErrorsValidator()]
  }
  )

  /**
   * Generates the debugging exercises, given the program description, correct version of the program, and the number of syntax, runtime, and logical errors provided by the user.
   * Calls the OpenAI API using the fine-tuned GPT model for the debugging exercises.
   */
  generateExercise() {
    console.log(this.programDetailsForm.value.correctProgram)
    this.exerciseGenerated = true;
  }

  //Originally returns some sort of type error as AbstractControl isn't passed into the function so had to set strict to false in tsconfig (haven't investigated consequences of this)
  //See https://stackoverflow.com/questions/63305056/cannot-implement-validatorfn-interface
  static numberErrorsValidator(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
        const numberSyntaxErrors = form.get("numberSyntaxErrors").value;
        const numberRuntimeErrors = form.get("numberRuntimeErrors").value;
        const numberLogicalErrors = form.get("numberLogicalErrors").value;

        console.log(numberSyntaxErrors + numberRuntimeErrors + numberLogicalErrors)
        if (numberSyntaxErrors + numberRuntimeErrors + numberLogicalErrors == 0) {
          return {noErrors: true}
        }

        return null;
    }
  }
}
