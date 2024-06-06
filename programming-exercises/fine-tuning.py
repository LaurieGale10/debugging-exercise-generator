import json
import csv

system_prompt = """You are a teacher creating debugging exercises for secondary school students learning to program in Python. Your task is to add a number of errors to a program specified by the user.

You will be provided with the following information:
- A description of what the program is meant to do in <description> XML tags.
- A correct Python program that fulfils the program description in <correct-program> XML tags.
- A number of syntax errors to add to the program in <syntax> XML tags.
- A number of runtime errors to add to the program in <runtime> XML tags.
- A number of logical errors to add to the program in <logical> XML tags.

You must complete the following steps, all enclosed in <root> XML tags:
1) Consider where you could add the number of errors specified by the user. Enclose this thinking with <thinking> XML tags.
2) Inject the specified number of syntax, runtime, and logical errors into the program and enclose it in <incorrect-program> XML tags.
3) Within <error-location> XML tags, write the line number of each error that you have injected. Ensure the line numbers correctly correspond to the lines containing errors within the incorrect program.
4) Explain each error you have injected within <explanation> XML tags."""

#Go through every csv row and add an entry to the messages list, including the appropriate user and assistant content
#But indentation matters, how to get this working?

training_examples = []

def format_content(user_content: str, assistant_content: str) -> json:
    return [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_content}, {"role": "assistant", "content": assistant_content}]

def create_training_json(csv_file_name: str, json_file_name: str = "fine_tuning_training_parsed.jsonl") -> json:
    """Generates a JSON file to be used for fine-tuning, given a CSV file name.

    Args:
        file_name (str): Filename of the csv

    Returns:
        json: Training data contained with JSON format.
    """
    with open(csv_file_name, newline='', encoding="utf8") as csvfile, open(json_file_name, "w") as jsonfile:
        reader = csv.reader(csvfile)
        for row in reader:
            formatted_json = {"messages": format_content(row[1], row[2])}
            json.dump(formatted_json, jsonfile)
            jsonfile.write("\n") #TODO: Edit so there's no trailing newline
    return training_examples

def save_to_jsonl(training_examples: json, file_name: str = "fine_tuning_training_parsed.jsonl"):
    with open(file_name, "w") as outfile: #TODO: Could I just do this within the foreach loop in create_training_json? Check complexitys of opening file compared to for loop.
        for row in training_examples:
            formatted_json = {"messages": row}
            json.dump(formatted_json, outfile)
            outfile.write("\n") #TODO: Edit so there's no trailing newline

create_training_json("fine_tuning_training.csv") #Make sure this is run in current directory