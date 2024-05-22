/**
 * A type expressing all the necesary information to build the UI for a LLM-generated debugging exercise.
 * This includes the following:
 * incorrectProgram: The program containing errors in it.
 * errorExplanations: The explanation for each error
 * fullResponse: The original response from the LLM
 */
export type GeneratedExercise = {
    incorrectProgram: string,
    errorExplanations: Array<string>,
    fullResponse: string,
    regenerationNumber: number
}