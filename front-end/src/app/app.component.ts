import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Validators } from '@angular/forms';
import {ClipboardModule} from '@angular/cdk/clipboard';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { CodeViewerComponent } from "./code-viewer/code-viewer.component";
import { OpenAI } from 'openai';
import { environment } from './../environments/environment';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass',
    imports: [RouterOutlet, ReactiveFormsModule, CommonModule, NgFor, ClipboardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, CodeViewerComponent]
})
export class AppComponent {
  title = 'front-end';
  
  openai: OpenAI = new OpenAI({ apiKey: environment.openAiApiKey, dangerouslyAllowBrowser: true});
  systemPrompt: string = `You are a resource developer creating debugging exercises for secondary school students learning to program in Python. Your task is to edit a program so that it contains a specified number of errors.

  You will be provided with the following information:
  - A short, correct Python program in <correct-program> XML tags.
  - A description of what the program should do in <description> XML tags.
  - A number of syntax to add to the program in <syntax> XML tags.
  - A number of runtime to add to the program in <runtime> XML tags.
  - A number of logical to add to the program in <logical> XML tags.
  
  You must complete then following steps, each enclosed in <root> XML tags:
  1) Think about where you could add the specified number of errors. Enclose this thinking with <thinking> XML tags.
  2) Inject the specified number of syntax, runtime, and logical errors into the program. Enclose the incorrect program in <incorrect-program> XML tags.
  3) Within the <error-location> tags, write the line number of each error that has been injected. Ensure the line numbers correspond to the lines containing errors within the program in the <incorrect-program> tags
  4) Explain each error you have injected within <explanation> XML tags.`;


  sampleProgram: string = 'year_born = input("What year were you born in? ")\nage = 2023-int(year_born)\n\nfirst_name = input("What is your first name? ")\nlast_name = input("What is your last name? ")\nprint("Your name is",first_name,last_name,"and at the end of this year you will be", age)';

  sampleProgramDescription: string = 'This program inputs the user\'s first name, surname, and the year they were born. It then prints a sentence to the screen with their full name and how old they will be at the end of the year.\n\nIf a user\'s first name is Jo, their last name is Bloggs, and they were born in 2008, the program should print: "Your name is Jo Bloggs and at the end of this year you will be 15".';

  exerciseGenerated: boolean = false;
  responseText: string = `
  <root>
  <thinking>
  To add syntax errors to the program, I can introduce mistakes like misspelling a variable, forgetting quotation marks, or using incorrect operators. For this program, I can consider altering the way the input function is used or changing variable names.
  </thinking>

  <incorrect-program>
  year_born = inpt("What year were you born in? ")
  age = 2023-int(year_born)
      
  first_name = input("What is your first name? )
  last_name = input("What is your last name?")
  print("Your name is" first_name, last_name, "and at the end of this year you will be" + age)
  </incorrect-program>

  <error-location>
  - Line 1
  - Line 5
  </error-location>

  <explanation>
  1. In line 1, the input function is misspelled as 'inpt' instead of 'input'. \n
  2. In line 5, the quotation mark is missing at the end of the string within the input function.
  </explanation>
  </root>`;

  incorrectProgram: string | null = null;
  errorExplanations: Array<string> = [];
  fullResponse: string | null = null;
  loading: boolean = false; //Variable that tracks whether any elment is loading

  parser: DOMParser = new DOMParser();

  constructor(private formBuilder: FormBuilder) {}

  //Using FormBuilder due to less amount of boiler plate code (also discussed here: https://stackoverflow.com/questions/56015702/angular-form-builder-vs-form-control-and-form-group)
  programDetailsForm = this.formBuilder.group({ //Creates a group of FormControls
    programDescription: [this.sampleProgram, Validators.required],
    correctProgram: [this.sampleProgramDescription, Validators.required],
    numberSyntaxErrors: ['', Validators.required],
    numberRuntimeErrors: ['', Validators.required],
    numberLogicalErrors: ['', Validators.required]
  }, {
    validators: [AppComponent.numberErrorsValidator(), AppComponent.syntacticallyValidCodeValidator()]
  }
  )

  /**
   * Generates the debugging exercises, given the program description, correct version of the program, and the number of syntax, runtime, and logical errors provided by the user.
   * Calls the OpenAI API using the fine-tuned GPT model for the debugging exercises.
   */
  async generateExercise() {
    let userPrompt = `
    <description>
    `+this.programDetailsForm.value.programDescription+`
    </description>
    
    <correct-program>
    `+this.programDetailsForm.value.correctProgram+`
    </correct-program>
    
    <syntax>`+this.programDetailsForm.value.numberSyntaxErrors+`</syntax>
    <runtime>`+this.programDetailsForm.value.numberRuntimeErrors+`</runtime>
    <logical>`+this.programDetailsForm.value.numberLogicalErrors+`</logical>`;

    this.loading = true;
    const completion = await this.openai.chat.completions.create({
      messages: [{ 
          role: "system", content: this.systemPrompt
        },
        {
          role: "user", content: userPrompt
        }
      ],
      model: "gpt-3.5-turbo",
    });
    this.loading = false;
    this.fullResponse = completion.choices[0].message.content;

    //Parses response as XML document to allow for easy query.
    //TODO: Add initial error handling in case response is not in valid HTML (try regenerating response X number of times)
    const xmlDoc = this.parser.parseFromString(this.fullResponse, "text/xml"); //XML isn't valid - need to get it all in a root tag
    let incorrectProgram: string = xmlDoc.querySelector("incorrect-program").textContent; //TODO: Remove heading and tailing blank lines
    this.incorrectProgram = incorrectProgram.replace(/^\n+|\n+$/g, '');
    let explanation: string = xmlDoc.querySelector("explanation").textContent;
    this.errorExplanations = explanation.split("\n\n");

    this.exerciseGenerated = true;
  }

  //Originally returns some sort of type error as AbstractControl isn't passed into the function so had to set strict to false in tsconfig (haven't investigated consequences of this)
  //See https://stackoverflow.com/questions/63305056/cannot-implement-validatorfn-interface
  static numberErrorsValidator(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
        const numberSyntaxErrors = form.get("numberSyntaxErrors").value;
        const numberRuntimeErrors = form.get("numberRuntimeErrors").value;
        const numberLogicalErrors = form.get("numberLogicalErrors").value;

        if (numberSyntaxErrors + numberRuntimeErrors + numberLogicalErrors == 0) {
          return {noErrors: true}
        }
        return null;
    }
  }

  static syntacticallyValidCodeValidator(): ValidatorFn {
    return (form: FormControl): ValidationErrors | null => {
      //Check code is syntactically valid here
      return null;
    }
  }


}
