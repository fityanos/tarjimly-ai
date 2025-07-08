/**
 * Tarjimly CLI Tests
 *
 * - Tests positive and negative cases for the CLI translation tool.
 * - Uses execSync to run the CLI as a child process and capture output.
 * - Verifies language mapping and argument validation.
 */
import languageNames from "./languageNames.js";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.resolve(__dirname, "index.js");

/**
 * Helper to run the CLI with given arguments and capture output.
 * Returns stdout or error output as string.
 */
function runCLI(args = "") {
  try {
    return execSync(`node ${CLI_PATH} ${args}`, { encoding: "utf8" });
  } catch (e) {
    return e.stdout + e.stderr;
  }
}

/**
 * Main test suite for the Tarjimly CLI.
 * Covers positive and negative cases for argument parsing, language mapping, and translation logic.
 */
describe("Tarjimly CLI", () => {
  test("positive: valid language codes with --ai", () => {
    const output = runCLI("hello en it --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: valid language codes with -a", () => {
    const output = runCLI("hello en it -a");
    expect(output).toMatch(/In/);
  });

  test("positive: valid full language names in mapping", () => {
    // This test is for the mapping, not CLI, since CLI expects codes
    expect(languageNames["it"]).toBe("Italian");
    expect(languageNames["en"]).toBe("English");
  });

  test("positive: valid full language names as CLI args with --ai", () => {
    const output = runCLI("hello english italian --ai");
    expect(output).toMatch(/In/);
  });

  test("negative: missing --ai flag", () => {
    const output = runCLI("hello en it");
    expect(output).toMatch(/AI flag not set/);
  });

  test("negative: missing both languages", () => {
    const output = runCLI("hello --ai");
    expect(output).toMatch("A parameter is missing. Correct command should be <word or phrase> <from language> <to language>");
  });

  test("negative: missing 'to' language", () => {
    const output = runCLI("hello en --ai");
    expect(output).toMatch("A parameter is missing. Correct command should be <word or phrase> <from language> <to language>");
  });

  test("negative: missing 'from' language", () => {
    const output = runCLI("hello it --ai");
    // This will treat 'hello' as the word, 'it' as from, and missing to
    expect(output).toMatch("A parameter is missing. Correct command should be <word or phrase> <from language> <to language>");
  });

  test("negative: invalid language code", () => {
    const output = runCLI("hello qq it --ai");
    expect(output).toMatch("'from' and/or 'to' language is required and must be valid");
  });

  test("negative: from and to are the same", () => {
    const output = runCLI("hello en en --ai");
    expect(output).toMatch(/must be different/);
  });

  test("positive: case-insensitive language codes", () => {
    const output = runCLI("hello EN IT --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: case-insensitive language names", () => {
    const output = runCLI("hello ENGLISH ITALIAN --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: mixed-case language codes and names", () => {
    const output = runCLI("hello eN ItaLian --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: multi-word language names", () => {//bug
    const output = runCLI("hello scots gaelic italian --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: extra spaces in arguments", () => {
    const output = runCLI("   hello    en    it   --ai   ");
    expect(output).toMatch(/In/);
  });

  test("positive: text with special characters", () => {
    const output = runCLI("hello!@# en it --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: text with numbers", () => {
    const output = runCLI("12345 en it --ai");
    expect(output).toMatch(/In/);
  });

  test("negative: language code that is a substring of another (e.g., 'en' vs 'en-gb')", () => {
    const output = runCLI("hello en-gb it --ai");
    expect(output).toMatch("'from' and/or 'to' language is required and must be valid");
  });

  test("negative: invalid but plausible language name", () => {
    const output = runCLI("hello klingon italian --ai");
    expect(output).toMatch("'from' and/or 'to' language is required and must be valid");
  });

  test("negative: empty text", () => {
    const output = runCLI("  en it --ai");
    expect(output).toMatch("A parameter is missing");
  });

  test("negative: only one argument", () => {
    const output = runCLI("hello --ai");
    expect(output).toMatch("A parameter is missing");
  });

  test("negative: only two arguments", () => {
    const output = runCLI("hello en --ai");
    expect(output).toMatch("A parameter is missing. Correct command should be <word or phrase> <from language> <to language>");
  });

  test("positive: text with leading/trailing spaces", () => {
    const output = runCLI("   hello world   en it --ai");
    expect(output).toMatch(/In/);
  });

  test("positive: double-quoted multi-word text", () => {
    const output = runCLI('"hello world" en it --ai');
    expect(output).toMatch(/In/);
  });

  test("positive: single-quoted multi-word text", () => {
    const output = runCLI("'hello world' en it --ai");
    expect(output).toMatch(/In/);
  });

  test("negative: no-quoted multi-word text", () => {
    const output = runCLI("hello world en it --ai");
    expect(output).toMatch(/In/);
  });

}); 