# Plot a Plot – Dan Harmon Story Circle

### Feature Development and Implementation Plan

---

## 1. Feature Overview

**Feature name:** Plot a Plot
**Tagline:** Feeling stuck? Craft a Plot.
**Section title:** Dan Harmon Story Circle

**Purpose:**

Plot a Plot is an interactive story-development tool integrated into the existing screenwriting application. It helps users construct a movie or screenplay plot using Dan Harmon's eight-stage Story Circle structure.

The feature provides a circular visual representation of the story, allowing users to enter information into each of the eight divisions, monitor their writing progress, and revise their plot whenever necessary.

The Story Circle must be saved as part of the screenplay's respective `.sdach` file.

---

## 2. Accessing the Feature

**Existing application menu:** Tools and documents settings.

Add a new feature button:

**Button title:** Plot a Plot
**Tagline displayed beneath the button:** Feeling stuck? Craft a Plot.
**Action:** Clicking the button opens the Plot a Plot workspace.

The feature should be accessible from the existing application without opening an entirely separate application.

---

## 3. Story Circle Editor Page

**Page title:** Dan Harmon Story Circle

The editor page consists of:

1. Story Circle visualization.
2. Eight interactive story divisions.
3. Story information input fields.
4. Act descriptions and explanations.
5. Progress tracking.
6. Editing controls.
7. PDF export functionality.

The circular chart is the primary interface element.

### 3.1 Circular Chart Structure

The chart must strictly follow the reference diagram below.

![Dan Harmon Story Circle reference diagram](story_circle_enhanced.png)

It consists of FOUR concentric circular layers:

**Layer 1 – Outer Circle: GREEN**
- Represents ACT 1.
- Establishes the character and their familiar world.
- Contains the first and eighth story divisions.

**Layer 2 – Second Circle: YELLOW**
- Represents ACT 2.
- Contains the second and seventh story divisions.

**Layer 3 – Third Circle: RED**
- Represents ACT 3.
- Contains the third, fourth, fifth and sixth story divisions.

**Layer 4 – Centre Circle: PINK**
- Represents THE END.
- Located at the exact centre of the chart.
- Remains circular and visible above the other layers.

### 3.2 Eight Story Divisions

The chart must be divided into eight equal radial sections, each occupying 45 degrees.

The divisions must follow this exact clockwise sequence, beginning in the upper-right section:

1. **ZONE OF COMFORT**
2. **DESIRE SOMETHING**
3. **ENTERS UNFAMILIAR SITUATION (DEFEAT / OVERPOWERED)**
4. **ADAPTS TO SITUATION**
5. **OVERCOMES (GETS WHAT THEY WANT)**
6. **PAYS THE HEAVY PRICE**
7. **RETURNS TO FAMILIAR SITUATION (ZONE OF COMFORT)**
8. **CHANGES AS A RESULT OF JOURNEY**

The eight divisions must remain in their designated positions.

The user must not be able to accidentally rearrange the divisions or change their designated act colours.

### 3.3 Chart Appearance

- All four circular layers must share the same centre.
- All eight divisions must have equal angular measurements.
- Radial dividing lines must extend consistently through the three coloured rings.
- The centre circle must contain the text THE END.
- Use visible dark outlines between the circular layers.
- Use the reference diagram's green, yellow, red and pink colour arrangement, rendered in high-contrast tones.
- The chart must retain its circular proportions when resized.
- Story information must be displayed within its corresponding division or through a clearly associated interactive editing panel.

---

## 4. Story Input and Editing System

Each of the eight divisions must accept user input.

When a user selects a division, its corresponding editing interface opens.

Each editing interface contains:

**A. Story point title**
- Automatically populated with the designated division name.
- Not editable to prevent structural mistakes.

**B. Story description**
- A multiline text editor where the user describes what happens at this stage of the story.

**C. Character actions**
- Optional description of what the protagonist does at this stage.

**D. Important events**
- Optional description of important events, discoveries, conflicts or decisions.

**E. Save changes**
- Saves the information to the corresponding story division.

**F. Edit**
- Allows the user to reopen and modify previously entered information.

**G. Clear**
- Allows the user to clear the contents of an individual division after confirmation.

All eight divisions must be independently editable.

The user must be able to leave the editor and return later without losing previously entered information.

---

## 5. Act Explanation Panel

Beneath the circular chart, the preview must display written explanations of the story points.

The explanations must be arranged into three sections corresponding to the three acts.

### ACT 1 – GREEN: THE BEGINNING

**Story points 1 and 8**

1. **Zone of Comfort:** Introduces the protagonist, their everyday life, environment and current circumstances.
8. **Changes as a Result of Journey:** Demonstrates how the protagonist has changed as a consequence of the journey. This completes the transition into the story's new normal.

### ACT 2 – YELLOW: THE JOURNEY

**Story points 2 and 7**

2. **Desire Something:** Establishes what the protagonist wants or believes they need.
7. **Returns to Familiar Situation:** The protagonist returns to a familiar environment or situation, but their experiences have changed their perspective.

### ACT 3 – RED: THE CONFLICT AND RESOLUTION

**Story points 3, 4, 5 and 6**

3. **Enters Unfamiliar Situation:** The protagonist enters an unfamiliar environment or faces a situation in which they are defeated, overwhelmed or out of their depth.
4. **Adapts:** The protagonist learns to navigate the unfamiliar situation and develops new approaches.
5. **Overcomes:** The protagonist achieves what they originally wanted.
6. **Pays the Heavy Price:** The protagonist experiences the consequences, sacrifices or costs associated with obtaining what they wanted.

Each explanation section must also display the user's written story information.

The panel must update automatically whenever the user edits a story point.

---

## 6. Story Progress Tracking

Introduce a progress-tracking checkbox (TICK) for each of the eight divisions.

**Purpose:** Allow the screenwriter to monitor how far they have progressed in writing the actual screenplay.

Each story division must have:

- A checkbox or tick control.
- Its corresponding story point title.
- Its written plot description.
- Its completion status.

**How it works:**

1. The user develops a plot using the Story Circle.
2. The user writes the actual screenplay in the main script editor.
3. When the user reaches and completes a particular story point in their screenplay, they can return to Plot a Plot.
4. They tick the corresponding story division.
5. The application saves that division's completion status.

The tick indicates that the corresponding section has been written in the screenplay.

It must NOT automatically mark a story point complete merely because the user has entered a plot description. The user must manually control the completion status.

Display an overall progress indicator, for example:

**Story progress: 5/8 completed – 62.5%**

The completion status must be editable and reversible.

---

## 7. Preview and Interaction

The editor should provide a preview of the complete Story Circle.

The preview consists of:

**A. Circular chart**
- Displays the four coloured layers.
- Shows all eight story divisions.
- Displays the completion status of each division.
- Allows users to select a division to edit its contents.

**B. Act explanation panel**
- Displays the written explanations.
- Displays the user's corresponding story descriptions.
- Groups the divisions according to their respective acts.

**C. Progress summary**
- Displays completed and outstanding divisions.
- Shows the overall completion percentage.

**D. Editing controls**
- Edit individual story points.
- Save modifications.
- Clear individual story points.
- Reopen previously saved information.

The chart and its explanatory text must always reflect the latest saved information.

---

## 8. PDF Export

Provide an **Export as PDF** button.

The exported document must contain:

1. Document title: Dan Harmon Story Circle.
2. The complete coloured circular chart.
3. All eight story division titles.
4. The user's written descriptions.
5. The three act explanations.
6. Story completion indicators.
7. Overall progress summary.

The PDF must be a separate document from the screenplay.

Exporting the PDF must NOT remove, replace or modify the original screenplay.

The user should be able to export an updated PDF whenever the plot changes.

---

## 9. Integration with the .sdach File Format

**IMPORTANT: The Story Circle is an integral part of the screenplay project.**

Although the PDF is exported separately, the actual Story Circle data must be stored inside the respective screenplay's `.sdach` file.

The application must not rely on the exported PDF as its primary storage format.

### Required stored information

The `.sdach` file must preserve:

- Story Circle title.
- Chart configuration.
- Four circular layer definitions.
- Eight fixed story divisions.
- Story point titles.
- User-written descriptions.
- Character actions.
- Important events.
- Act assignments.
- Progress checkbox states.
- Overall progress information.
- Last modification information.

### File integration behaviour

1. When the user opens a screenplay `.sdach` file, its associated Story Circle must also be available.
2. When the user edits a story point, the changes must be saved into the same screenplay file.
3. Closing the screenplay must not erase the Story Circle.
4. Reopening the screenplay must restore the chart and all previously entered information.
5. Exporting the chart to PDF must create an independent document without affecting the `.sdach` file.
6. Editing the chart after PDF export must update the `.sdach` file, not the previously exported PDF.

If a screenplay does not yet have a Story Circle, the application should initialize an empty one when the user first opens the feature.

---

## 10. Data Validation and Protection

The application must enforce the following rules:

- Exactly eight story divisions.
- Exactly four concentric circular layers.
- Fixed act colours.
- Fixed story point order.
- No accidental deletion of the entire Story Circle.
- No loss of information when switching between editing and preview modes.
- No loss of completion statuses after reopening a screenplay.
- Validate Story Circle data when opening a `.sdach` file.
- Handle missing or invalid Story Circle data without corrupting the screenplay.

The application should also support automatic saving or clearly indicate when changes are unsaved.

---

## 11. Suggested Page Layout

**Top section**

- Page title: Dan Harmon Story Circle.
- Back button.
- Save status.
- Export PDF button.

**Main section**

- Large circular Story Circle visualization.
- Eight selectable divisions.
- Colour-coded act indicators.

**Below the chart**

- Act 1 explanation and story information.
- Act 2 explanation and story information.
- Act 3 explanation and story information.

**Bottom section**

- Overall story progress.
- Eight completion indicators.
- Editing and saving controls.

---

## 12. Final Development Requirements

The completed feature must satisfy the following:

1. Accessible through Tools and documents settings.
2. Button named Plot a Plot.
3. Tagline: Feeling stuck? Craft a Plot.
4. Editor page titled Dan Harmon Story Circle.
5. Four concentric circular layers, matching the supplied reference.
6. Green outer layer – Act 1.
7. Yellow second layer – Act 2.
8. Red third layer – Act 3.
9. Pink centre circle – The End.
10. Eight equal divisions in the specified clockwise order.
11. Individual user-input fields for all eight divisions.
12. Editable story information.
13. Explanatory text beneath the chart.
14. Manual progress tick for each story division.
15. Overall progress calculation.
16. Independent PDF export.
17. Complete Story Circle integration into the screenplay's `.sdach` file.
18. Restoration of all chart information when reopening the screenplay.
19. Ability to revise the entire Story Circle without losing existing screenplay content.

---

## Final Objective

Plot a Plot should function as an integrated visual story-planning editor. It should allow a screenwriter to construct a complete story structure, see how each plot point relates to the three acts, monitor their screenplay-writing progress, and preserve the entire planning process within the screenplay's own `.sdach` file.
