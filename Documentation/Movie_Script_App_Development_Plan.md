# Movie Script Writing App – Structured Development Plan

## 1. App Overview

**Proposed app concept:** A mobile screenplay-writing application with an interface similar to Microsoft Word, specifically designed for writing, formatting, editing, and exporting movie scripts.

The application should provide a familiar document-editing experience while automatically applying professional screenplay formatting.

**Main objective:** Allow users to write movie scripts on their phones without manually adjusting margins, spacing, indentation, or screenplay elements.

### Core Design Direction

The reference image shows a screenplay editor with the following characteristics:

- **Document title and progress:** "Tangle and Moss", page 11 of 30.
- **Character names:** Highlighted in yellow (for example, TANGLE).
- **Dialogue:** Some lines are highlighted in green (for example, MOSSY's lines).
- **Comments:** A purple comment flag is shown beside a line.
- **Tools panel:** A bottom panel contains Find & Replace, Character Highlighting, Styles, Rebuild SmartType, Header & Footer, Title Page, Preview, and Revision.

### Key Settings

| Property | Setting |
|---|---|
| Font | Courier |
| Primary interface | Word processor |
| Platform | Android / iOS |
| Output | PDF screenplay |

---

## 2. Main Application Structure

The application can be divided into six primary sections.

1. **Home / Dashboard:** Access existing scripts, create new scripts, and manage documents.
2. **Script Editor:** Main writing environment with a Word-like editing interface.
3. **Script Manager:** Organize, rename, duplicate, delete, and search scripts.
4. **Export / Preview:** Preview screenplay pages and export documents into PDF.
5. **Settings:** Configure document preferences, storage, and application behaviour.
6. **File Management:** Open, save, import, and manage the application's native script files.

---

## 3. Home Screen Design

The home screen should resemble a document management dashboard.

The reference image shows a dark-mode document list with entries such as "I/O 25 everything", "Google I/O 2025 drafts", "Android Show", and "M3E". Each entry shows a "Modified by me" date. Floating options for "Choose template" and "New document" appear above the list.

### Recommended Components

- App logo and application name.
- New Script button.
- Recent Scripts section.
- Search bar.
- Folders or script collections.
- Recently modified date.
- Document settings and profile access.

### New Script Workflow

1. User taps New Script.
2. Application creates a blank screenplay.
3. User enters the movie title.
4. User optionally enters the writer's name.
5. Application opens the script editor.

---

## 4. Script Editor

This is the central feature of the application. The interface should borrow the functionality of Microsoft Word while being optimized for screenplay writing.

**Further reading referenced in the plan:**

- "Writing How-To: Format a Script/Screenplay" (Michelle Sommerville, Applaudience, Medium)
- "How to Outline a Screenplay" (Final Draft)
- "JotterPad 14 Android Update: What's In Store"

### A. Editor Layout

The editor should be divided into four sections.

| Section | Function |
|---|---|
| Top toolbar | Save status, undo, redo, export and menu |
| Document area | Main screenplay writing surface |
| Formatting toolbar | Screenplay element selection |
| Keyboard area | Text input and navigation |

### B. Permanent Font Configuration

The application should have a fixed typography system.

| Property | Setting |
|---|---|
| Font family | Courier |
| Font size | 12 pt document standard |
| Font colour | Black |
| Background | White |
| Line spacing | Screenplay standard |
| Font selection | Disabled |
| Bold / Italic | Optional screenplay styling |

**Important:** Users should not be able to change the font family. Every script should maintain the Courier typeface, including exported documents.

**Recommendation:** Use Courier Prime or Courier New, provided the selected font is bundled with the application.

### C. Screenplay Formatting Elements

A screenplay is different from an ordinary Word document. It uses specific formatting conventions. The editor should support these elements:

1. **Scene Heading:** Identifies location and time of day.

   ```
   INT. POLICE STATION – NIGHT
   ```

2. **Action:** Describes what the audience sees and hears.

   ```
   John enters the room and places his bag on the table.
   ```

3. **Character:** Identifies the speaking character.

   ```
   JOHN
   ```

4. **Dialogue:** The character's spoken words.

   ```
   I thought you weren't coming back tonight.
   ```

5. **Parenthetical:** Provides an acting direction.

   ```
   (whispering)
   ```

6. **Transition:** Indicates a transition between scenes.

   ```
   CUT TO:
   ```

### D. Formatting Toolbar

Instead of forcing users to manually indent text, introduce a screenplay formatting toolbar.

**Screenplay elements in the toolbar:**

- Scene Heading
- Action
- Character
- Dialogue
- Parenthetical
- Transition

These are formatting controls, not different fonts.

When a user selects an element, the application automatically applies the appropriate:

- Left and right indentation.
- Text alignment.
- Capitalization.
- Spacing.
- Paragraph positioning.

### E. Intelligent Keyboard Behaviour

This is particularly important on a phone. The editor should automatically suggest the next screenplay element.

**Example workflow:**

1. User writes a scene heading.
2. Presses Enter.
3. Editor automatically changes to Action.
4. User writes an action paragraph.
5. Presses Enter.
6. Editor can suggest Character.
7. User selects or enters a character name.
8. Presses Enter to move to Dialogue.
9. Presses Enter twice to return to Action.

The user should also be able to manually override the suggestions.

---

## 5. Script Management and Document Storage

Each screenplay should exist as an independent document.

### Recommended Features

- Create new script.
- Open existing script.
- Rename script.
- Duplicate script.
- Delete script.
- Organize scripts into folders.
- Search by title.
- Display last modified date.
- Automatic saving.

### Storage Approach

- Implement **local storage first**, so users can write without an internet connection.
- Introduce a **custom file extension** for the application's native screenplay documents, rather than relying exclusively on Word documents.

**Example:** `The_Last_Journey.sdscript`

The application would recognize, open, validate, and edit its own file format.

---

## 6. Export and Printing

The application should have a dedicated export system.

| Format | Purpose |
|---|---|
| PDF | Printing and sharing finished scripts |
| Native file | Reopening and editing scripts |
| Fountain | Interoperability with other screenwriting tools |
| FDX | Compatibility with Final Draft workflows |

### The PDF Export Should Preserve

- Courier typography.
- Screenplay margins.
- Scene headings.
- Character positioning.
- Dialogue indentation.
- Page numbers.
- Page breaks.

The user should be able to preview the final screenplay before exporting.

---

## 7. Settings and Additional Features

### Recommended Settings

| Setting | Description |
|---|---|
| Auto-save | Automatically save document changes |
| Page display | Continuous or individual pages |
| Dark mode | Dark editor interface, while preserving white screenplay pages |
| Word count | Display total words |
| Page count | Display estimated screenplay pages |
| Find and replace | Search and edit text |
| Undo / redo | Reverse editing operations |
| Screen lock | Prevent accidental editing |
| Backup | Export or back up screenplay files |

### Additional Features to Consider Later

- Character name recognition.
- Scene numbering.
- Scene navigation.
- Character dialogue statistics.
- Revision history.
- Screenplay collaboration.
- Script version comparison.

---

## 8. Recommended Technology Stack

Since React Native development is being considered, the following architecture is suitable.

### Application Architecture

**React Native Mobile Application**, which includes:

- **User interface and navigation**
- **Screenplay Editor:** Text input, formatting, keyboard behaviour and pagination.
- **Document Manager:** File creation, loading, saving and validation.
- **Local Storage:** SQLite or filesystem-based storage.
- **PDF Generator:** Screenplay page rendering and PDF export.
- **Native Screenplay File:** The application's custom file format.

### Suggested Development Technologies

| Component | Technology |
|---|---|
| Mobile framework | React Native + Expo |
| Programming language | JavaScript |
| Navigation | React Navigation |
| Editor | Custom rich-text editor or structured screenplay editor |
| Local database | SQLite |
| File handling | Expo FileSystem |
| PDF generation | HTML-to-PDF or PDF library |
| Font | Bundled Courier font |
| Backend | Not required initially |

### Do You Need MongoDB?

**No**, not for the initial application.

If the application saves scripts locally, the entire first version can be built without MongoDB or an online backend. Cloud synchronization and collaboration can be introduced later.

---

## 9. Development Roadmap

Build the application in phases rather than developing every feature simultaneously.

1. **Phase 1: Application Foundation**
   - Home screen.
   - New script creation.
   - Navigation.
   - Document manager.

2. **Phase 2: Screenplay Editor**
   - Courier font integration.
   - Text editing.
   - Screenplay element formatting.
   - Keyboard behaviour.
   - Undo and redo.

3. **Phase 3: Document Management**
   - Native file structure.
   - Save and load.
   - Auto-save.
   - File validation.

4. **Phase 4: Screenplay Layout**
   - Standard screenplay margins.
   - Page breaks.
   - Pagination.
   - Page numbering.

5. **Phase 5: Export**
   - PDF generation.
   - Preview.
   - Printing and sharing.

6. **Phase 6: Advanced Features**
   - Character recognition.
   - Scene management.
   - Backup.
   - Cloud synchronization.

---

## 10. Minimum Viable Product (MVP)

The first working version should contain only these features.

### MVP Development Checklist

**Progress: 0 / 14 completed**

- [ ] Create a new screenplay
- [ ] Open and edit existing screenplays
- [ ] Permanent Courier font
- [ ] 12-point screenplay typography
- [ ] Scene heading formatting
- [ ] Action formatting
- [ ] Character formatting
- [ ] Dialogue formatting
- [ ] Parenthetical formatting
- [ ] Transition formatting
- [ ] Automatic saving
- [ ] Custom screenplay file format
- [ ] PDF export
- [ ] Page numbering and pagination

---

## 11. Recommendation

Prioritize the **screenplay editor and its formatting engine** above everything else.

A visually attractive, Word-like interface is relatively straightforward to build. The more important engineering challenge is making screenplay text behave correctly, format itself automatically, and maintain professional page layouts.
