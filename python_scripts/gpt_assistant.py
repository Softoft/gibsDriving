import asyncio
import logging
import os
import shutil
import time
from pathlib import Path

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

TRANSLATE_TO_DUTCH_ASSISTANT = "asst_wjGiaTz1woV0lC8io4XiLZ7T"


def get_all_dir_files(directory_path: Path, exclude_dir_names: list[str]) -> list[Path]:
    all_files = []
    for path in directory_path.rglob('*'):
        if any(exclude_dir_name in path.parts for exclude_dir_name in exclude_dir_names):
            continue
        if path.is_file():
            all_files.append(path)
    return all_files


class ChatAssistant:
    def __init__(self, assistant_id):
        self.assistant_id = assistant_id

    def _calc_time_to_wait(self, prompt, time_passed_seconds):
        expected_duration = len(prompt) / 100
        return (abs(expected_duration - time_passed_seconds) / 2) + expected_duration / 10

    async def chat_assistant(self, prompt, thread=None) -> str:
        my_updated_assistant = client.beta.assistants.retrieve(self.assistant_id)
        if thread is None:
            thread = client.beta.threads.create()
        client.beta.threads.messages.create(thread_id=thread.id, role="user", content=prompt, )
        run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=my_updated_assistant.id)

        current_run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        print(f"Started Run")
        start_time = time.time()
        while current_run.status not in ["completed", "cancelled", "failed", "expired"]:
            current_run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            await asyncio.sleep(self._calc_time_to_wait(prompt, time.time() - start_time))
        if current_run.status != "completed":
            print(f"Run failed with status {current_run.status}")
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        print(f"Run finished after {time.time() - start_time} seconds, prompt length: {len(prompt)} ")
        return messages.data[0].content[0].text.value


class AssistantRunner:
    def __init__(self, assistant, chunk_size=4_000):
        self.assistant: ChatAssistant = assistant
        self.chunk_size: int = chunk_size

    def _divide_file_into_chunks(self, file_path: Path):
        chunks = []
        current_chunk = []
        current_size = 0
        with open(file_path, encoding="utf-8") as file:
            for line in file:
                current_chunk.append(line)
                current_size += len(line)

                if current_size > self.chunk_size and line.strip() == '':
                    chunks.append('\n'.join(current_chunk))
                    current_chunk = []
                    current_size = 0

        if current_chunk:
            chunks.append('\n'.join(current_chunk))

        print(f"Divided {file_path} into {len(chunks)} chunks")
        return chunks

    async def run_on_file(self, file_path: Path):
        try:
            print(f"Running GPT on {file_path}")
            thread = client.beta.threads.create()
            results = [await self.assistant.chat_assistant(chunk, thread) for chunk in
                       self._divide_file_into_chunks(file_path)]
            improved_text = "\n".join(results)
            file_path.write_text(improved_text, encoding="utf-8")
            print(f"Finished improving {file_path}")
        except Exception as e:
            print(f"Error while improving {file_path}: {e}")

    async def run_on_dir(self, dir_path: Path):
        tasks = []
        for path in get_all_dir_files(dir_path, []):
            tasks.append(self.run_on_file(path))
        await asyncio.gather(*tasks)


def delete_dir(base_path: Path):
    for item in base_path.iterdir():
        shutil.rmtree(item, ignore_errors=True)
        item.unlink(missing_ok=True)
    os.rmdir(base_path)


def delete_nl_blogs():
    try:
        delete_dir(Path("../nl/blog"))
    except FileNotFoundError:
        pass


def create_copy(original_dir: Path, copy_into: Path, throws_exception=False):
    try:
        if copy_into.exists():
            shutil.rmtree(copy_into)
        shutil.copytree(original_dir, copy_into)
    except Exception as e:
        logging.info(f"Error while copying {original_dir} to {copy_into}: {e}")
        if throws_exception:
            raise e


def copy_en_blogs_to_nl():
    create_copy(Path("../en/blog"), Path("../nl/blog"))


def clean_files(directory):
    dir_path = Path(directory)

    for file_path in dir_path.iterdir():
        if file_path.is_file():
            with open(file_path, encoding='utf-8') as file:
                lines = file.readlines()

            if len(lines) > 1:
                lines = lines[1:-1]

            content = ''.join(lines).replace('\n\n', '\n')

            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)


def create_nl_blogs():
    delete_nl_blogs()
    copy_en_blogs_to_nl()
    translate_assistant = ChatAssistant(TRANSLATE_TO_DUTCH_ASSISTANT)
    translate_runner = AssistantRunner(translate_assistant, 20_000)
    asyncio.run(translate_runner.run_on_dir(Path("../nl/blog")))
    clean_files("../nl/blog")


if __name__ == '__main__':
    clean_files("../nl/blog")
