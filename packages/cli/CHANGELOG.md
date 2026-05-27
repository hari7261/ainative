# @hari7261/ainative-cli

## 0.3.1

### Patch Changes

- Refresh the generated starter around a centered prompt-first UI with a minimal header and focused composer
- Update the built-in input controls to use compact icon actions for file attach, modes, recording, and send behavior
- Document Windows `EPERM` global install failures and recommend the `npx` flow first

## 0.3.0

### Minor Changes

- Refresh the generated starter around AINative's built-in Studio-style chat workspace
- Remove the older custom prompt-box dependency stack from the default template
- Align CLI version output, init banner text, and generated package versions for the `0.3.0` release

## 0.2.0

### Minor Changes

- Add advanced AI prompt box template with multi-modal support
  - Advanced PromptInputBox component with image uploads, voice recording, and smart modes
  - Multi-modal input support (text, images via drag & drop/paste/upload, voice)
  - Smart modes: Search, Think, and Canvas for specialized AI interactions
  - Modern UI with Radix UI primitives and Framer Motion animations
  - Full-screen image preview dialog
  - Comprehensive README and documentation
  - New dependencies: @radix-ui/react-dialog, @radix-ui/react-tooltip, framer-motion, lucide-react

## 0.1.1

### Initial Release

- Basic `ainative init` command with starter template
- `ainative dev`, `ainative build`, `ainative preview` commands
- `ainative doctor` for dependency checking
- `ainative add-provider` for environment setup
