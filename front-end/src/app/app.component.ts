import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Validators } from '@angular/forms';
import { GeneratedExerciseViewComponent } from './generated-exercise-view/generated-exercise-view.component';
import { GeneratedExercise } from './types/types';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { CodeViewerComponent } from "./code-viewer/code-viewer.component";
import { OpenAI } from 'openai';
import { environment } from './../environments/environment';
import dedent from 'dedent';
import { GenericDialogBoxComponent } from './generic-dialog-box/generic-dialog-box.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass',
    imports: [RouterOutlet, ReactiveFormsModule, CommonModule, NgFor, GeneratedExerciseViewComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, CodeViewerComponent, GenericDialogBoxComponent]
})
export class AppComponent {
  title = 'front-end';
  
  testingUI: boolean = true;
  
  openai: OpenAI = new OpenAI({ apiKey: environment.openAiApiKey, dangerouslyAllowBrowser: true});
  systemPrompt: string = dedent(`
  You are a resource developer creating debugging exercises for secondary school students learning to program in Python. Your task is to edit a program so that it contains a specified number of errors.

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
  4) Explain each error you have injected within <explanation> XML tags.`); //This doesn't change - needs to be formatted properly


  sampleProgram: string = 'year_born = input("What year were you born in? ")\nage = 2023-int(year_born)\n\nfirst_name = input("What is your first name? ")\nlast_name = input("What is your last name? ")\nprint("Your name is",first_name,last_name,"and at the end of this year you will be", age)';
  sampleProgramDescription: string = 'This program inputs the user\'s first name, surname, and the year they were born. It then prints a sentence to the screen with their full name and how old they will be at the end of the year.\n\nIf a user\'s first name is Jo, their last name is Bloggs, and they were born in 2008, the program should print: "Your name is Jo Bloggs and at the end of this year you will be 15".';

  exerciseGenerated: boolean = false;
  fullResponse: string | null = null;
  errorExplanations: Array<string> = [];

  programDetailsForm: FormGroup;
  incorrectProgram: string | null = null;
  loading: boolean = false;
  regenerationLimit: number = 3;
  remainingRegenerations: number = this.regenerationLimit;
  exceptionalRemainingRegenerations: number = 3; //Number of regeneration attempts allowed in the event that the model outputs a response that is not in a valid XML format, or otherwise generates an error.
  generatedExercises: Array<GeneratedExercise> = [];

  parser: DOMParser = new DOMParser();

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
      //Using FormBuilder due to less amount of boiler plate code (also discussed here: https://stackoverflow.com/questions/56015702/angular-form-builder-vs-form-control-and-form-group)
    this.programDetailsForm = this.formBuilder.group({ //Creates a group of FormControls
      programDescription: [this.sampleProgramDescription, Validators.required],
      correctProgram: [this.sampleProgram, Validators.required],
      numberSyntaxErrors: ['', Validators.required],
      numberRuntimeErrors: ['', Validators.required],
      numberLogicalErrors: ['', Validators.required]
    }, {
      validators: [AppComponent.numberErrorsValidator(), AppComponent.syntacticallyValidCodeValidator()]
    })
  }

  /**
   * Simulates the generation of a debugging exercise through interaction with Chat Completions API by returning a dummy XML string after x seconds
   * @param timeout Number of seconds to delay returning variable for
   */
  simulateGenerateExercise(timeout: number = 2): string {
    let dummyResponseText: string = dedent(`
    <root>
      <thinking>
      To add a syntax error, I could introduce a missing colon at the end of one of the lines.
      </thinking>
      
      <incorrect-program>
      year_born = input("What year were you born in? ")
      age = 2023-int(year_born)
  
          first_name = input("What is your first name? ")
      last_name = input("What is your last name? ")
      print("Your name is",first_name,last_name,"and at the end of this year you will be", age)
      </incorrect-program>
      
      <error-location>
      3
      </error-location>
      
      <explanation>
      I have introduced a syntax error by omitting the colon at the end of line 3 after the input() function.
      </explanation>
    </root>`);

    let dummyResponseNoRoot: string = dedent(`
      <thinking>
      To add a syntax error, I could introduce a missing colon at the end of one of the lines.
      </thinking>
      
      <incorrect-program>
      year_born = input("What year were you born in? ")
      age = 2023-int(year_born)
  
          first_name = input("What is your first name? ")
      last_name = input("What is your last name? ")
      print("Your name is",first_name,last_name,"and at the end of this year you will be", age)
      </incorrect-program>
      
      <error-location>
      3
      </error-location>
      
      <explanation>
      I have introduced a syntax error by omitting the colon at the end of line 3 after the input() function.
      </explanation>`);

    let dummyResponseUnindented: string = dedent(`
    <root>
    <thinking>
    To add a syntax error, I could introduce a missing colon at the end of one of the lines.
    </thinking>
      
    <incorrect-program>
    year_born = input("What year were you born in? ")
    age = 2023-int(year_born)
  
    first_name = input("What is your first name? ")
    last_name = input("What is your last name? ")
    print("Your name is",first_name,last_name,"and at the end of this year you will be", age)
    </incorrect-program>
    
    <error-location>
    3
    </error-location>
    
    <explanation>
    I have introduced a syntax error by omitting the colon at the end of line 3 after the input() function.
    </explanation>
    </root>`);

    let dummyResponseWithoutExplanation: string = dedent(`
    <root>
    <thinking>
    To add a syntax error, I could introduce a missing colon at the end of one of the lines.
    </thinking>
      
    <incorrect-program>
    year_born = input("What year were you born in? ")
    age = 2023-int(year_born)
  
    first_name = input("What is your first name? ")
    last_name = input("What is your last name? ")
    print("Your name is",first_name,last_name,"and at the end of this year you will be", age)
    </incorrect-program>
    
    <error-location>
    3
    </error-location>
    
    </root>`);

    return dummyResponseNoRoot;
  }

  async fetchReponse(userPrompt: string): Promise<string> {
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
    let fullResponse: string = completion.choices[0].message.content;
    return fullResponse;
  }

  /**
   * Generates the debugging exercises, given the program description, correct version of the program, and the number of syntax, runtime, and logical errors provided by the user.
   * Calls the OpenAI API using the fine-tuned GPT model for the debugging exercises.
   */
  async generateExercise() {

    let userPrompt = dedent(`
    <description>
    `+this.programDetailsForm.value.programDescription+`
    </description>
    
    <correct-program>
    `+this.programDetailsForm.value.correctProgram+`
    </correct-program>
    
    <syntax>`+this.programDetailsForm.value.numberSyntaxErrors+`</syntax>
    <runtime>`+this.programDetailsForm.value.numberRuntimeErrors+`</runtime>
    <logical>`+this.programDetailsForm.value.numberLogicalErrors+`</logical>`); //This also needs to be formatted properly

    this.loading = true;
    let fullResponse: string;

    if (!this.testingUI) {
      fullResponse = await this.fetchReponse(userPrompt);
    }
    else {
      fullResponse = this.simulateGenerateExercise();
    }

    this.loading = false;
    console.log(fullResponse)

    //Parses response as XML document to allow for easy access of relevant information.
    try {
      const xmlDoc: XMLDocument = this.parser.parseFromString(fullResponse, "text/xml");
      console.log(xmlDoc)
      let incorrectProgram: string = dedent(xmlDoc.querySelector("incorrect-program").textContent); //This will also remove trailing whitespace from any possible indentation of first line - figure out a fix for this. However, it does currently maintain the rest of the indentation

      let explanation: string = xmlDoc.querySelector("explanation").textContent;
      let errorExplanations: Array<string> = explanation.split("\n\n");
      let regenerationNumber: number = this.regenerationLimit - this.remainingRegenerations;
  
      this.exerciseGenerated = true; //TODO: This needs some work - getting to the danger of having too many boolean variables to fulfill
      this.remainingRegenerations--;
  
      this.generatedExercises.push({
        incorrectProgram,
        errorExplanations,
        fullResponse,
        regenerationNumber
      });
    }
    catch (e: any) {
      if (this.exceptionalRemainingRegenerations <= 0) {
        console.error("The LLM did not generate a valid response after three attempts.")

        const dialogRef = this.dialog.open(GenericDialogBoxComponent, {
          data: {
            title: "Oops!",
            content: "Looks the like the model's having trouble generating a valid response. Try refreshing the page or adjusting your prompts."
          }
        });

        // Manually restore focus to the menu trigger since the element that
        // opens the dialog won't be in the DOM any more when the dialog closes.
        //dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
      }
      else {
        console.error("The LLM did not generate a valid response, regenerating response.")
        this.exceptionalRemainingRegenerations--;
        this.generateExercise();
      }
    }
  }

  /**
   * Function to determine what string to display on the submit button of the LLM prompt form
   * Expressed as a form rather than purely in the Angular HTML interpolation to improve readability
   * @returns String to display on the submit button
   */
  submitButtonDisplay(): string {
    return this.remainingRegenerations == 0 ? "You've used all your regenerations" : this.loading ? "Generating Exercise" : this.exerciseGenerated ? "Regenerate Exercise ("+this.remainingRegenerations+" remaining)" : "Generate Exercise";
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
