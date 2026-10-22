# DevTools

Free, ad-free developer utilities that run in your browser. DevTools is a React and TypeScript app with no application backend: tool inputs are processed locally, and selected editor contents and preferences are saved in your browser's local storage.

**Live app:** [devtools.mariombn.com](https://devtools.mariombn.com/)

## Tools

| Tool | What it does |
| --- | --- |
| [JSON Toolkit](https://devtools.mariombn.com/json) | Validate, format, and minify JSON. |
| [Validators](https://devtools.mariombn.com/validators) | Check CPF, CNPJ, email syntax, and credit-card numbers (Luhn check). |
| [Data Generator](https://devtools.mariombn.com/generator) | Generate Brazilian sample data, passwords, and placeholder text; includes sample data for other countries. |
| [Text Comparator](https://devtools.mariombn.com/diff) | Compare text in split or unified views. |
| [Bcrypt Generator](https://devtools.mariombn.com/bcrypt) | Generate bcrypt hashes and verify text against a hash. |
| [Crypto Toolkit](https://devtools.mariombn.com/crypto) | Encode/decode Base64, calculate hashes, and encrypt/decrypt text with supported algorithms. |
| [Markdown Preview](https://devtools.mariombn.com/markdown) | Preview Markdown with GitHub-flavored Markdown and syntax highlighting. |
| [Mermaid Diagrams](https://devtools.mariombn.com/mermaid) | Edit and preview diagrams, then export SVG or PNG. |
| [SQL Tools](https://devtools.mariombn.com/sql) | Format SQL with syntax highlighting. |
| [Date & Time Tools](https://devtools.mariombn.com/dates) | Convert Unix timestamps and time zones, compare dates, validate ISO dates, and add or subtract periods. |
| [Regex Tools](https://devtools.mariombn.com/regex) | Test regular expressions and inspect matches and capture groups. |
| [Rule of Three](https://devtools.mariombn.com/rule-of-three) | Calculate direct or inverse proportions. |

The interface supports English and Portuguese, light and dark themes, and installation as a PWA. Most tools work offline after the app has been loaded. Mermaid's diagram engine is downloaded when first used, so open that tool online once before relying on it offline.

## Run locally

**Requirements:** Node.js 20.19+ or 22.12+ and npm.

```bash
git clone https://github.com/mariombn/devtools.git
cd devtools
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To check a production build:

```bash
npm run build
npm run preview
```

The build is written to `dist/`. Run `npm run lint` to check the code with ESLint.

## Privacy and limitations

- The tools do not send their input to an application backend. Some editors persist their contents in `localStorage`; clear the input in the tool or clear this site's browser storage when working with sensitive material. Avoid entering secrets on a shared device.
- The password generator currently uses `Math.random()` and should **not** be used for security-sensitive credentials.
- The Crypto Toolkit includes legacy algorithms. Do not treat Base64, MD5, SHA-1, DES, 3DES, RC4, or Rabbit as modern protection for sensitive data.
- Generated identity and contact data is intended for testing. It is not proof of a real identity, address, or reachable contact.

## Project structure

```text
src/
  App.tsx             Routes for the tools
  components/         Shared UI, layout, and date/time components
  hooks/              Clipboard and local-storage hooks
  i18n/               English and Portuguese translations
  pages/              One page per tool
  theme/              Theme provider
  utils/              Formatting, generation, regex, math, and Mermaid utilities
public/               Static assets and PWA icons
```

The app uses React 19, TypeScript, Vite 7, Tailwind CSS 4, React Router 7, and `vite-plugin-pwa`. Add a tool by creating a page under `src/pages/`, registering its route in `src/App.tsx`, and adding it to `src/components/Layout/Sidebar.tsx`. Put reusable, UI-independent logic under `src/utils/`.

## Contributing

Issues and pull requests are welcome. Before opening a PR, run `npm run lint` and `npm run build`. Include the behavior you changed and how you verified it.

## License

This repository does not currently include a license file; its license has not been specified.
