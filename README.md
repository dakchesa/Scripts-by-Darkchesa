# Scripts by Darkchesa 🎬
> Professional Mobile Screenplay Writing Application

**Scripts by Darkchesa** is a mobile screenplay editor built with React Native and Expo. It delivers a familiar, Word-processor document experience while automatically applying industry-standard Hollywood screenplay formatting, intelligent element sequencing, character highlighting, and a database-free native project storage standard using the `.sdach` file format.

---

## 🌟 Core Features

### 1. Proprietary Native `.sdach` File Format (No Database Needed)
- Screenplays can be stored and exported entirely inside portable **`.sdach`** files (`SDACH_SCRIPT_FORMAT`).
- Shows exact saved device location upon export, with instant Open and Share actions.
- Users can import/open any existing `.sdach` file directly from device storage or iCloud/Google Drive using the built-in document picker.
- Complete data integrity validation, character color palettes, scene elements, notes/comments, and metadata are preserved.
- Local offline persistence via high-speed device storage cache ensures users can write anywhere without internet access like a note-making app.

### 2. Microsoft Word-like Document Interface
- Dedicated screenplay document surface with permanent **Courier New** font size 13 typography.
- Standard Hollywood screenplay margins (1.5" left margin, 1.0" top/bottom/right).
- Page break visualization and live pagination progress (e.g. `(1 of 1)`).
- Continuous scroll and page-by-page display options.
- Dark editor interface with authentic, high-contrast screenplay paper surface.
- Sized comfortably for easy selection and touch targets on mobile screens.

### 3. Offline Vector Heroicons
- 100% offline-ready vector Heroicons for all actions, navigation, and tools.
- Zero network requests or CDN dependencies needed to display crisp iconography.

### 4. Screenplay Formatting Engine
Supports all standard screenplay elements:
- **Scene Heading:** Automatic uppercase, scene numbering, bold formatting (e.g., `INT. POLICE STATION – NIGHT`).
- **Action:** Standard narrative block, line wrapping.
- **Character:** Centered character positioning, uppercase standard.
- **Dialogue:** Hollywood dialogue indents and constrained reading column.
- **Parenthetical:** Italicized acting directions enclosed in `(parentheses)`.
- **Transition:** Uppercase, right-aligned (e.g., `CUT TO:`).

### 5. Intelligent Keyboard Behaviour
- `Scene Heading` + Enter ➔ Changes automatically to `Action`.
- `Action` + Enter ➔ Suggests / transitions to `Character`.
- `Character` + Enter ➔ Transitions to `Dialogue`.
- `Dialogue` + Enter ➔ Transitions to `Action` (or Enter twice).
- `Parenthetical` + Enter ➔ Transitions to `Dialogue`.
- `Transition` + Enter ➔ Transitions to `Scene Heading`.
- **1-Tap Formatting Toolbar:** Instantly switch any block between `[SCENE]`, `[ACTION]`, `[CHAR]`, `[DIAL]`, `[PAREN]`, and `[TRANS]`.
- **SmartType Autocomplete:** Discovers character names in real time and presents 1-tap autocomplete pills.

### 6. Character Highlighting & Comments
- Color-code character names and their dialogue lines (e.g., **TANGLE** in yellow, **MOSSY** in green).
- Add inline notes and comments represented by flag badges beside screenplay lines.

### 7. Export & Sharing System with Device Location
- **Native `.sdach`**: Portable project file showing target save location on device with Open and Share options.
- **Hollywood Standard PDF**: Authentic Courier New PDF with title page positioned cleanly at the top of the page (no blank pages), page numbers, and exact screenplay margins.
- **Direct Open & Share**: Open exported files in system viewer or browser and share via device share sheet.

### 8. Dashboard & Management
- Document management dashboard with recent scripts, modified dates, word count, and estimated page counts.
- Search bar to instantly filter scripts by title or screenwriter.
- Duplicate, rename, and delete scripts with confirmation.
- Starter templates: *Feature Film Standard*, *Television Episode*, *Blank Screenplay*, and the preloaded sample *Tangle and Moss*.

---

## 🚀 Running the App

### Prerequisites
- Node.js installed

### Commands
```bash
# Start the Expo development server
npm start

# Run on Android phone or emulator
npm run android

# Run on iOS device or simulator (macOS required for iOS build)
npm run ios

# Run in Web browser / mobile browser
npm run web
```

---

## 📁 Project Architecture

```
app/
├── App.js                         # Root entry with Dark/Light theme provider
├── app.json                       # Expo config & .sdach file associations
├── package.json                   # Dependencies and npm scripts
├── assets/                        # App icons and splash screens
├── sample_projects/
│   └── Tangle_and_Moss.sdach      # Pre-generated sample .sdach project
├── test/
│   └── verify_app.mjs             # 32/32 passing verification test suite
└── src/
    ├── types/
    │   └── screenplay.js          # Element types, constants, next element maps
    ├── constants/
    │   ├── theme.js               # Courier typography, dimensions, color palettes
    │   └── templates.js           # Screenplay templates and sample script
    ├── utils/
    │   └── platform.js            # Cross-platform helper
    ├── services/
    │   ├── sdachFileService.js    # .sdach format serializer, parser, validator & picker
    │   ├── storageService.js      # Offline device storage & script repository
    │   ├── pdfService.js          # Hollywood standard PDF screenplay generator
    │   └── fountainService.js     # Fountain format export & import
    ├── components/
    │   ├── ScreenplayEditor.js    # Word-like document surface with pagination
    │   ├── FormattingToolbar.js   # Screenplay formatting & SmartType toolbar
    │   ├── TopToolbar.js          # Word-style top bar with undo/redo, status & share
    │   ├── ToolsModal.js          # Bottom tools sheet matching spec
    │   ├── FindReplaceModal.js    # Find & replace in script
    │   ├── CharacterHighlightModal.js # Character color assignment
    │   ├── ScriptPreviewModal.js  # Page-by-page screenplay preview
    │   ├── NewScriptModal.js      # New script creator dialog
    │   └── ScriptCard.js          # Dashboard script card with action menu
    └── screens/
        ├── HomeScreen.js          # Document management dashboard
        └── EditorScreen.js        # Full screenplay editing environment
```
