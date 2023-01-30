#!/usr/bin/env node
import { access, readFile } from "fs/promises";
import { ensureFolder, ask, safeWrite } from "./utils.js";

const configFileName = "component-creator.json";
let config;
const componentName = process.argv[2] ?? await ask("Write future component name: ");
const customPath = process.argv[3];

async function loadExtSettings() {
  const rawText = await readFile(`./${configFileName}`, { encoding: "utf-8" })
  const text = JSON.parse(rawText);
  return text;
}

async function createNewSettings() {
  const defaultPath = await ask("Write default path to store your components (relative from the project root or absolute):");
  const stylesExt = await ask("Write your stylesheet file extension with dot (ex: \".css\"):");
  let styleModules;
  if (stylesExt) {
    styleModules = await ask("Would you like to use module styles? (y/n)");
  }
  const allowTs = await ask("Would you use TypeScript? (y/n)");
  const allowTestFiles = await ask("Would you like to include test file? (y/n)");
  
  return { 
    defaultPath,
    stylesExt: stylesExt || null,
    tsEnable: allowTs === "y",
    testFileEnable: allowTestFiles === "y",
    styleModuleEnable: styleModules === "y",
  };
}

try { 
  config = await loadExtSettings();
} catch {
  config = await createNewSettings();
  safeWrite("./component-creator.json", JSON.stringify(config));
}

if (customPath) {
  config.defaultPath = customPath;
}

async function createJsFile(filePath, fileName) {
  let styleImportStr;
  if (config.stylesExt) {
    if (config.styleModuleEnable) {
      styleImportStr = `import css from "${fileName}.module${config.stylesExt}";`
    } else {
      styleImportStr = `import from "${fileName}${config.stylesExt}";`
    }
  }
  styleImportStr &&= `${styleImportStr}\n`;
  
  const template = `import React from "react";
${styleImportStr ?? ""}
function ${fileName}() {
  return (
    <h1>I'm ${fileName} Component</h1>
  )
}`;
  try {
    await access(filePath)
  } catch {
    await safeWrite(filePath, template);
  }
}

async function createIndexFile(filePath, fileName) {
  const template = `export { ${fileName} } from "./${fileName}";`;
  await safeWrite(filePath, template);
}

async function createStyleFile(filePath) {
  if (config.stylesExt) {
    await safeWrite(filePath, "");
  }
}

async function createTestFile(filePath) {
  if (config.testFileEnable) {
    await safeWrite(filePath, "");
  }
}

async function main() {
  const titleCaseComponentName = componentName.slice(0, 1).toUpperCase() + componentName.slice(1);

  const filePath = await ensureFolder(`${config.defaultPath}/${titleCaseComponentName}`);

  const fileExt = config.tsEnable ? ".ts" : ".js";
  const jsxExt = `${fileExt}x`;

  const programFileName = `${filePath}/${titleCaseComponentName}${jsxExt}`;
  const indexFileName = `${filePath}/index${fileExt}`;
  const styleFileName = `${filePath}/${titleCaseComponentName}${config.styleModuleEnable ? ".module" : ""}${config.stylesExt}`;
  const testFileName = `${filePath}/${titleCaseComponentName}.spec${fileExt}`;

  createStyleFile(styleFileName);
  createJsFile(programFileName, titleCaseComponentName);
  createIndexFile(indexFileName, titleCaseComponentName);
  createTestFile(testFileName);

}

main();
