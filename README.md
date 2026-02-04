# DevTools

A collection of free, ad-free developer tools to make your life easier. Built with modern web technologies and designed with a focus on privacy - all processing happens in your browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)

## Features

### JSON Toolkit
- **Format & Minify**: Pretty-print or compress JSON data
- **Validate**: Check JSON syntax and structure
- **Sort Keys**: Organize JSON keys alphabetically

### Data Generator
Generate realistic test data for your applications:
- **CPF**: Brazilian tax ID with formatting options
- **CNPJ**: Brazilian company tax ID
- **Phone Numbers**: Mobile and landline with DDD (area code)
- **CEP**: Brazilian postal code
- **Names**: Random Brazilian names with Faker.js
- **Emails**: Generate email addresses
- **Passwords**: Customizable password generation (length, uppercase, lowercase, numbers, special chars)
- **Lorem Ipsum**: Generate placeholder text (paragraphs, sentences, or words)

### Text Comparator
- Side-by-side text comparison
- Character-level diff highlighting
- Line-by-line analysis
- Visual indicators for additions, deletions, and changes

### Bcrypt Generator
- **Hash Generation**: Create bcrypt hashes with configurable rounds (4-20)
- **Hash Verification**: Verify if a hash matches the original text
- **Security Info**: Built-in FAQ and best practices

## Live Demo

Visit the live application: https://devtools.mariombn.com/

## Installation

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/mariombn/devtools.git
cd devtools
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
devtools/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Common/       # Shared components
│   │   ├── icons/        # Custom animated icons
│   │   ├── Layout/       # Layout components (Sidebar, TopBar)
│   │   └── ui/           # Base UI components (buttons, inputs, etc)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components (routes)
│   │   ├── BcryptGenerator/
│   │   ├── DataGenerator/
│   │   ├── JsonToolkit/
│   │   └── TextComparator/
│   ├── theme/            # Theme provider and configuration
│   ├── utils/            # Utility functions
│   │   ├── formatters/   # Data formatting utilities
│   │   └── generators/   # Data generation utilities
│   ├── App.tsx           # Main app component with routing
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── dist/                 # Production build (generated)
```

## Contributing

Contributions are welcome! This is an open-source project and we'd love your help to make it better.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- This project uses ESLint for code quality
- Run `npm run lint` before committing
- Follow existing code patterns and conventions
- Write meaningful commit messages


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
