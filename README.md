## What's inside

```bash
├── bin
│   └── tarjimly.js
├── src
│   ├── index.js             # CLI entry point
│   ├── languageNames.js     # Language code/name mapping
│   ├── parseArgs.js         # CLI argument parsing
│   └── index.test.js        # CLI tests
├── .env.example             # Example environment variables
├── package.json
└── README.md
```

---

## How it works
- The CLI sends translation requests directly to OpenAI using your own API key.
- Developer Experience
  - ISO 639-1 language code to language name mapping is included for easiness. You can use lang_code or lang_name
  - CaseSsensitive iS HanDled
  - "Quoted" and unquoted search words
---

## Setup for local CLI usage

1. **Clone the repo and install dependencies:**
   ```sh
   git clone <your-repo-url>
   cd tarjimly-ai
   npm install
   ```
2. **Set up your `.env` file:**
   - Copy `.env.example` to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=sk-...
     ```

## Setup as npm Package

> **Tip:** For easy access, install globally:
> ```sh
> npm i tarjimly -g
> ```
> Or use `npx` if published to npm.

## Run the CLI:
```sh
tarjimly hello world english italian --ai
```
Or, for local development:
```sh
node src/index.js hello world english italian --ai
```
- **Multi-word statements:** You can enter the text to translate with or without quotes. The CLI will always treat the last two arguments as the source and target languages, and everything before as the text to translate.

### Environment Variables

This package requires an OpenAI API key.

1. Create a `.env` file in your project root with:
   ```
   OPENAI_API_KEY=your-openai-key-here
   ```
2. Or set the variable in your shell:
   ```sh
   export OPENAI_API_KEY=your-openai-key-here
   ```

If `OPENAI_API_KEY` is not set, the CLI will show an error and exit.

## How to Test

Run the test suite:
```sh
npm test
```

---

## License
MIT
