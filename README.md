# Tarjimly

Tarjimly is the Arabic word for "translate for me". This project provides a simple command-line translation tool powered by OpenAI GPT.

---

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
- The CLI sends translation requests directly to OpenAI using your own API key (set OPENAI_API_KEY in your .env file).
- No proxy server is required; all requests are made from your local machine to OpenAI.

---

## Setup

1. **Clone the repo and install dependencies:**
   ```sh
   git clone <your-repo-url>
   cd tarjimly
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

## How to Run

> **Tip:** For easy access, install globally:
> ```sh
> npm install -g .
> ```
> Or use `npx` if published to npm.

Run the CLI:
```sh
tarjimly "hello world" english italian --ai
```
Or, for local development:
```sh
node src/index.js "hello world" english italian --ai
```
- **Multi-word statements:** You can enter the text to translate with or without quotes. The CLI will always treat the last two arguments as the source and target languages, and everything before as the text to translate.

## How to Test

Run the test suite:
```sh
npm test
```

---

## License
MIT
