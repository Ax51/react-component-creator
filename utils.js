import { access, mkdir, writeFile } from "fs/promises";
import { createInterface } from "readline";

export function toTitleCase(str) {
  return str.split(" ").map((word) =>
    word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
}

export async function ensureFolder(path) {
  const safePath = path.replace("~", "").replaceAll(/\.\.\//g, "");
  try {
    await access(safePath);
  } catch {
    try {
      await mkdir(safePath, { recursive: true });
    } catch (err) {
      console.error(
        "Failed to ensure folder for path:\n",
        safePath,
        "\n",
        err,
      );
    }
  }
  return safePath;
}

export async function ask(question) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((res) => {
    readline.question(question, (answer) => {
      readline.close();
      res(answer);
    })
  })
}

export async function safeWrite(filePath, content) {
  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, content);
  }
}
