#!/usr/bin/env node
/**
 * Tarjimly CLI - Command-line translation tool using OpenAI GPT
 *
 * - Accepts text, source language, and target language as arguments.
 * - Supports both language codes and full language names.
 * - Outputs styled translation results to the terminal.
 *
 * Environment variables:
 *   - OPENAI_API_KEY: User's OpenAI API key for direct translation
 */
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import languageNames from "./languageNames.js";
import dotenv from "dotenv";
import { parseArgs } from "./parseArgs.js";
dotenv.config();

/**
 * Parses CLI arguments using yargs and sets up the --ai flag.
 */
const argv = yargs(hideBin(process.argv))
  .option("ai", {
    alias: "a",
    type: "boolean",
    description: "Use OpenAI GPT for translation via OpenAI API",
    default: false,
  })
  .argv;

/**
 * Helper to map a language name (case-insensitive) or code to its code.
 * @param {string} input - Language code or name
 * @returns {string|undefined} - Language code if found, else undefined
 */
function getLanguageCode(input) {
  if (!input) return undefined;
  const lower = input.toLowerCase();
  if (languageNames[lower]) return lower;
  for (const [code, name] of Object.entries(languageNames)) {
    if (name.toLowerCase() === lower) return code;
  }
  return undefined;
}

// Parse positional arguments: text, from, to
const positional = argv._;
if (positional.length < 3) {
  console.error(
    chalk.white.bgRed.bold(
      "A parameter is missing. Correct command should be <word or phrase> <from language> <to language>"
    )
  );
  process.exit(1);
}

// Use robust parsing for multi-word language names
const { text, fromInput, toInput } = parseArgs(positional);
const from = getLanguageCode(fromInput);
const to = getLanguageCode(toInput);

// Validate language arguments
if (!from || !to) {
  console.error(
    chalk.white.bgRed.bold("'from' and/or 'to' language is required and must be valid.")
  );
  process.exit(1);
}
if (from === to) {
  console.error(
    chalk.white.bgRed.bold("'from' and 'to' languages must be different.")
  );
  process.exit(1);
}
if (!languageNames[from]) {
  console.error(
    chalk.white.bgRed.bold(`'${fromInput}' is not a recognized language code or name.`)
  );
  process.exit(1);
}
if (!languageNames[to]) {
  console.error(
    chalk.white.bgRed.bold(`'${toInput}' is not a recognized language code or name.`)
  );
  process.exit(1);
}

/**
 * Calls the OpenAI API directly to perform translation using the user's API key.
 * @param {string} text - Text to translate
 * @param {string} from - Source language code
 * @param {string} to - Target language code
 */
async function callOpenAIDirect(text, from, to) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error(chalk.red("OPENAI_API_KEY must be set in your .env file to use direct OpenAI mode."));
    process.exit(1);
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a translation assistant." },
          { role: "user", content: `Translate \"${text}\" from ${languageNames[from] || from} to ${languageNames[to] || to}. Only return the translation.` }
        ]
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Unknown error from OpenAI");
    }
    const translation = data.choices?.[0]?.message?.content?.trim();
    const targetLangName = languageNames[to] || to;
    console.log(
      `In ` +
        chalk.bgYellow.bold(`${targetLangName}`) +
        `, ` +
        chalk.bgBlue.bold(`${text}`) +
        ` is: ` +
        chalk.bgGreen.bold(`${translation}`)
    );
  } catch (error) {
    console.error(chalk.red("OpenAI API error:", error.message || error));
  }
}

// Main CLI logic: only support direct OpenAI usage
if (argv._.length > 2) {
  if (argv.ai) {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      callOpenAIDirect(text, from, to);
    } else {
      console.error(
        chalk.red(
          "You must set OPENAI_API_KEY (for direct OpenAI usage) in your .env file."
        )
      );
      process.exit(1);
    }
  } else {
    console.log(
      chalk.white.bgRed.bold(
        "AI flag not set. pass '--ai' or '-a' at the end of the command to use AI translation"
      )
    );
  }
} else {
  console.error(
    chalk.white.bgRed.bold(
      "A parameter is missing. Correct command should be <word> <from language> <to language>"
    )
  );
}

