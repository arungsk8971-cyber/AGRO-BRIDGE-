# Contributing to Agro Bridge

Thank you for your interest in improving Agro Bridge!

## Development Principles

1. **Single-File Integrity**: Keep `index.html` self-contained (inline CSS, inline JavaScript, inline SVG illustrations/icons, and only Google Fonts externally). Avoid adding third-party UI frameworks or external image/icon libraries.
2. **Design & Color Discipline**: Maintain the warm paper palette (`#ffffff`, `#fcf3e8`, `#f0ddc5`), ink (`#0a0a0a`), warm tan (`#f1e3d3`), and terracotta accent (`#905831`), along with `Fraunces` and `Inter` typography.
3. **Pure Logic Testability**: Place pricing, payout, cart, and formatting logic in pure top-level functions inside `index.html` and add corresponding unit tests in `tests/agroBridge.test.ts`.
4. **No Web Storage or `<form>` Tags**: Keep state in memory for the demo and use semantic `<button type="button">` controls.

## Pull Request Workflow

1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes and run the full check suite:
   ```bash
   npx --yes tsx --test tests/agroBridge.test.ts
   npm run lint
   npm run build
   ```
3. Verify responsive layouts (`360px`, `768px`, and `1280px+`) with zero horizontal overflow.
4. Open a Pull Request describing the change and attaching updated screenshots if UI layout changed.
