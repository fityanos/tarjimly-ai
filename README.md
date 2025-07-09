# Tarjimly Translator CLI

A simple and powerful CLI tool for translating text using Tarjimly’s translation services.

---

## What's Inside

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

## How It Works

- The CLI sends translation requests directly to OpenAI using your own API key.
- Developer Experience
  - ISO 639-1 language code to language name mapping is included for easiness. You can use lang_code or lang_name
  - CaseSsensitive iS HanDled
  - "Quoted" and unquoted search words

---

## Environment Variables

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

---

## Install

You can use the package in two ways:

### Option 1: Install via npm (Globally)

```bash
npm install -g tarjimly
```
This makes the tarjimly command available anywhere in your terminal.


### Option 2: Clone the GitHub Repository

```bash
git clone https://github.com/fityanos/tarjimly-ai.git
cd tarjimly-ai
npm install
```
Then run the CLI with:

```bash
node src/index.js "Hello World!" english arabic --ai
```

## How to Test

```bash
npm test
```

## License
MIT