/**
 * Dan Harmon Story Circle - Types, Constants & Helpers
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Implements Dan Harmon's eight-stage Story Circle structure
 * with 4 concentric circular layers, 8 equal radial story divisions,
 * progress tracking, and validation rules.
 */

export const STORY_CIRCLE_LAYERS = [
  {
    id: 'layer1',
    name: 'Layer 1 – Outer Circle',
    act: 'ACT 1',
    color: '#22C55E', // Green
    label: 'Act 1',
    divisions: [1, 8],
    description: 'Establishes the character and their familiar world.',
  },
  {
    id: 'layer2',
    name: 'Layer 2 – Second Circle',
    act: 'ACT 2',
    color: '#FACC15', // Yellow
    label: 'Act 2',
    divisions: [2, 7],
    description: 'The journey beyond the comfort zone.',
  },
  {
    id: 'layer3',
    name: 'Layer 3 – Third Circle',
    act: 'ACT 3',
    color: '#EF4444', // Red
    label: 'Act 3',
    divisions: [3, 4, 5, 6],
    description: 'The conflict, adaptation, and heavy price.',
  },
  {
    id: 'layer4',
    name: 'Layer 4 – Centre Circle',
    act: 'THE END',
    color: '#F472B6', // Pink
    label: 'The End',
    divisions: [],
    description: 'The resolution at the exact centre of the chart.',
  },
];

export const STORY_CIRCLE_DIVISIONS_SPEC = [
  {
    id: 1,
    number: 1,
    title: 'ZONE OF COMFORT',
    subtitle: 'Zone of Comfort',
    act: 'ACT 1',
    actName: 'ACT 1 – GREEN: THE BEGINNING',
    layer: 'Layer 1 – Outer Circle: GREEN',
    color: '#22C55E',
    explanation: 'Introduces the protagonist, their everyday life, environment and current circumstances.',
  },
  {
    id: 2,
    number: 2,
    title: 'DESIRE SOMETHING',
    subtitle: 'Desire Something',
    act: 'ACT 2',
    actName: 'ACT 2 – YELLOW: THE JOURNEY',
    layer: 'Layer 2 – Second Circle: YELLOW',
    color: '#FACC15',
    explanation: 'Establishes what the protagonist wants or believes they need.',
  },
  {
    id: 3,
    number: 3,
    title: 'ENTERS UNFAMILIAR SITUATION (DEFEAT / OVERPOWERED)',
    subtitle: 'Unfamiliar Situation (defeat / overpowered)',
    act: 'ACT 3',
    actName: 'ACT 3 – RED: THE CONFLICT AND RESOLUTION',
    layer: 'Layer 3 – Third Circle: RED',
    color: '#EF4444',
    explanation: 'The protagonist enters an unfamiliar environment or faces a situation in which they are defeated, overwhelmed or out of their depth.',
  },
  {
    id: 4,
    number: 4,
    title: 'ADAPTS TO SITUATION',
    subtitle: 'Adapt to situation',
    act: 'ACT 3',
    actName: 'ACT 3 – RED: THE CONFLICT AND RESOLUTION',
    layer: 'Layer 3 – Third Circle: RED',
    color: '#EF4444',
    explanation: 'The protagonist learns to navigate the unfamiliar situation and develops new approaches.',
  },
  {
    id: 5,
    number: 5,
    title: 'OVERCOMES (GETS WHAT THEY WANT)',
    subtitle: 'Get what they want',
    act: 'ACT 3',
    actName: 'ACT 3 – RED: THE CONFLICT AND RESOLUTION',
    layer: 'Layer 3 – Third Circle: RED',
    color: '#EF4444',
    explanation: 'The protagonist achieves what they originally wanted.',
  },
  {
    id: 6,
    number: 6,
    title: 'PAYS THE HEAVY PRICE',
    subtitle: 'Pay Heavy Price',
    act: 'ACT 3',
    actName: 'ACT 3 – RED: THE CONFLICT AND RESOLUTION',
    layer: 'Layer 3 – Third Circle: RED',
    color: '#EF4444',
    explanation: 'The protagonist experiences the consequences, sacrifices or costs associated with obtaining what they wanted.',
  },
  {
    id: 7,
    number: 7,
    title: 'RETURNS TO FAMILIAR SITUATION (ZONE OF COMFORT)',
    subtitle: 'Return to familiar situation (zone of comfort)',
    act: 'ACT 2',
    actName: 'ACT 2 – YELLOW: THE JOURNEY',
    layer: 'Layer 2 – Second Circle: YELLOW',
    color: '#FACC15',
    explanation: 'The protagonist returns to a familiar environment or situation, but their experiences have changed their perspective.',
  },
  {
    id: 8,
    number: 8,
    title: 'CHANGES AS A RESULT OF JOURNEY',
    subtitle: 'Changed as a result of Journey',
    act: 'ACT 1',
    actName: 'ACT 1 – GREEN: THE BEGINNING',
    layer: 'Layer 1 – Outer Circle: GREEN',
    color: '#22C55E',
    explanation: 'Demonstrates how the protagonist has changed as a consequence of the journey. This completes the transition into the story’s new normal.',
  },
];

/**
 * Create a fresh default Story Circle object
 */
export function createDefaultStoryCircle(title = 'Dan Harmon Story Circle') {
  return {
    title: title || 'Dan Harmon Story Circle',
    tagline: 'Feeling stuck? Craft a Plot.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    layers: STORY_CIRCLE_LAYERS.map((layer) => ({ ...layer })),
    divisions: STORY_CIRCLE_DIVISIONS_SPEC.map((spec) => ({
      id: spec.id,
      number: spec.number,
      title: spec.title,
      subtitle: spec.subtitle,
      act: spec.act,
      actName: spec.actName,
      layer: spec.layer,
      color: spec.color,
      explanation: spec.explanation,
      description: '',
      characterActions: '',
      importantEvents: '',
      completed: false,
    })),
    progress: {
      completedCount: 0,
      totalCount: 8,
      percentage: 0,
    },
  };
}

/**
 * Calculate progress statistics for the 8 story divisions
 */
export function calculateStoryProgress(divisions = []) {
  if (!Array.isArray(divisions)) {
    return { completedCount: 0, totalCount: 8, percentage: 0 };
  }
  const completedCount = divisions.filter((d) => d && Boolean(d.completed)).length;
  const totalCount = 8;
  const percentage = Math.round((completedCount / totalCount) * 1000) / 10;
  return {
    completedCount,
    totalCount,
    percentage,
    formatted: `Story progress: ${completedCount}/${totalCount} completed – ${percentage}%`,
  };
}

/**
 * Validate and sanitize story circle data from .sdach or runtime
 */
export function validateAndSanitizeStoryCircle(rawStoryCircle) {
  if (!rawStoryCircle || typeof rawStoryCircle !== 'object') {
    return createDefaultStoryCircle();
  }

  const defaultCircle = createDefaultStoryCircle(rawStoryCircle.title);

  // Map and sanitize divisions, enforcing exact 8 divisions in fixed order
  const rawDivisionsMap = {};
  if (Array.isArray(rawStoryCircle.divisions)) {
    rawStoryCircle.divisions.forEach((div) => {
      if (div && typeof div.id === 'number') {
        rawDivisionsMap[div.id] = div;
      }
    });
  }

  const sanitizedDivisions = STORY_CIRCLE_DIVISIONS_SPEC.map((spec) => {
    const existing = rawDivisionsMap[spec.id] || {};
    return {
      id: spec.id,
      number: spec.number,
      title: spec.title, // Fixed to prevent structural mistakes
      subtitle: spec.subtitle,
      act: spec.act,
      actName: spec.actName,
      layer: spec.layer,
      color: spec.color,
      explanation: spec.explanation,
      description: typeof existing.description === 'string' ? existing.description : '',
      characterActions: typeof existing.characterActions === 'string' ? existing.characterActions : '',
      importantEvents: typeof existing.importantEvents === 'string' ? existing.importantEvents : '',
      completed: Boolean(existing.completed),
    };
  });

  const progress = calculateStoryProgress(sanitizedDivisions);

  return {
    title: typeof rawStoryCircle.title === 'string' && rawStoryCircle.title.trim()
      ? rawStoryCircle.title.trim()
      : 'Dan Harmon Story Circle',
    tagline: 'Feeling stuck? Craft a Plot.',
    createdAt: rawStoryCircle.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    layers: STORY_CIRCLE_LAYERS.map((layer) => ({ ...layer })),
    divisions: sanitizedDivisions,
    progress,
  };
}
