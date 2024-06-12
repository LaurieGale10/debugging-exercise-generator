import json
import os
from typing import IO

script_dir = os.path.dirname(__file__)
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

training_examples = []

def format_content(user_content: str, assistant_content: str) -> json:
    return [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_content}, {"role": "assistant", "content": assistant_content}]

def write_jsonl_line(user_content_filename: str, assistant_content_filename: str, jsonfile: IO):
    """Writes a single fine-tuning example interaction json object to a specified .jsonl file

    Args:
        user_content_filename (str): Name of the user content file to retrieve the example XML from for the fine-tuning example interaction
        assistant_content_filename (str): Name of the assistant content file to retrieve the example XML from for the fine-tuning example interaction
        jsonfile (IO): The json file object used to write the example interaction to
    """
    with open(user_content_filename, newline='', encoding="utf8") as user_content, open(assistant_content_filename, newline='', encoding="utf8") as assistant_content:
        formatted_json = {"messages": format_content(user_content.read(), assistant_content.read())}
        json.dump(formatted_json, jsonfile)
        jsonfile.write("\n")

def create_testing_json(examples_to_include: list[str], json_file_name: str = "fine_tuning_testing_parsed.jsonl"):
    """Generates a JSON file to be used for fine-tuning, given a CSV file name.

    Args:
        examples_to_include (list[str]): List of example numbers to include in testing set
        json_file_name (str, optional): Name of .jsonl file to write formatted jsonl testing data to. Defaults to "fine_tuning_testing_parsed.jsonl".
    """
    with open(json_file_name, "w") as jsonfile:
        for example in examples_to_include:
            user_content_filename = os.path.join(script_dir, f"fine_tuning_examples/testing/user_content/example_{example}_user.xml")
            assistant_content_filename = os.path.join(script_dir, f"fine_tuning_examples/testing/assistant_content/example_{example}_assistant.xml")
            write_jsonl_line(user_content_filename, assistant_content_filename, jsonfile)

def create_training_json(examples_to_include: list[str], json_file_name: str = "fine_tuning_training_parsed.jsonl"):
    """Generates a JSON file to be used for fine-tuning, given a CSV file name.

    Args:
        examples_to_include (list[str]): List of example numbers to include in training set
        json_file_name (str, optional): Name of .jsonl file to write formatted jsonl training data to. Defaults to "fine_tuning_training_parsed.jsonl".
    """
    with open(json_file_name, "w") as jsonfile:
        for example in examples_to_include:
            user_content_filename = os.path.join(script_dir, f"fine_tuning_examples/training/user_content/example_{example}_user.xml")
            assistant_content_filename = os.path.join(script_dir, f"fine_tuning_examples/training/assistant_content/example_{example}_assistant.xml")
            write_jsonl_line(user_content_filename, assistant_content_filename, jsonfile)

create_training_json([i for i in range(1,50)])
create_testing_json([i for i in range(1,11)])