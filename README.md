# Prototyping puzzles

This repository contains a series of puzzles designed to help you learn how to communicate visual design changes using Cursor AI. The goal is to help you practice making things look "not ugly" by effectively describing design improvements to AI.

## Getting started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Repository structure

```
app/
├── prototypes/           # Main working directory for all puzzles
│   ├── puzzle-01/       # Each puzzle lives in its own folder
│   │   ├── README.md    # Puzzle instructions and requirements
│   │   ├── page.tsx     # The puzzle component
│   │   └── styles.module.css
│   └── puzzle-02/
├── components/          # Shared components
└── public/             # Global static assets
```

## How the puzzles work

Each puzzle presents you with a basic, functional prototype that needs visual improvements.

## Tips for communicating design changes

When asking Cursor to help improve the visual design:

1. Be specific about what aspects need improvement
2. Use clear design terminology
3. Reference specific elements and their relationships
4. Provide context about the desired look and feel
5. Break down complex changes into smaller steps

Example request:
```
Could you help improve the visual hierarchy of this card component by:
1. Adding more breathing room between elements
2. Making the title more prominent
3. Softening the contrast of secondary text
```