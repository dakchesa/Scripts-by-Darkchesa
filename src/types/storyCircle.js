/**
 * Dan Harmon Expanded Story Circle - Types, Constants & Helpers
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Implements Dan Harmon's Expanded Story Circle structure:
 * - Four concentric circular layers (Green, Yellow, Red, Pink)
 * - ACT 1 - GREEN: THE BEGINNING (1.1 through 1.8)
 * - ACT 2 - YELLOW: THE MIDDLE (2.1 through 2.8)
 * - ACT 3 - RED: THE CLIMAX (3.1 through 3.8)
 * - THE END: Centre Circle (PINK)
 * - Progress tracking across 24 distinct story divisions
 */

export const STORY_CIRCLE_LAYERS = [
  {
    id: 'layer1',
    name: 'Layer 1 – Outer Circle: GREEN',
    act: 'ACT 1',
    actTitle: 'ACT 1 - GREEN: THE BEGINNING',
    color: '#22C55E', // Green
    label: 'Act 1: The Beginning',
    divisionPrefix: '1',
    description: 'The Beginning: Establishes the character, their ordinary world, and the first full journey loop.',
  },
  {
    id: 'layer2',
    name: 'Layer 2 – Second Circle: YELLOW',
    act: 'ACT 2',
    actTitle: 'ACT 2 - YELLOW: THE MIDDLE',
    color: '#FACC15', // Yellow
    label: 'Act 2: The Middle',
    divisionPrefix: '2',
    description: 'The Middle: Rising trials, unfamiliar territory, midpoint breakthrough, and crisis.',
  },
  {
    id: 'layer3',
    name: 'Layer 3 – Third Circle: RED',
    act: 'ACT 3',
    actTitle: 'ACT 3 - RED: THE CLIMAX',
    color: '#EF4444', // Red
    label: 'Act 3: The Climax',
    divisionPrefix: '3',
    description: 'The Climax: Confrontation, decisive adaptation, heavy sacrifice, and master transformation.',
  },
  {
    id: 'layer4',
    name: 'Layer 4 – Centre Circle: PINK',
    act: 'THE END',
    actTitle: 'THE END',
    color: '#F472B6', // Pink
    label: 'The End',
    divisionPrefix: 'end',
    description: 'The ultimate destination and complete thematic resolution at the exact centre of the chart.',
  },
];

export const CORE_8_STAGES = [
  {
    stage: 1,
    name: 'ZONE OF COMFORT',
    subtitle: 'Zone of Comfort',
    shortName: 'Comfort',
    angleDeg: 22.5, // Upper Right
  },
  {
    stage: 2,
    name: 'DESIRE SOMETHING',
    subtitle: 'Desire Something',
    shortName: 'Desire',
    angleDeg: 67.5, // Mid Right
  },
  {
    stage: 3,
    name: 'ENTERS UNFAMILIAR SITUATION',
    subtitle: 'Enters Unfamiliar Situation (defeat / overpowered)',
    shortName: 'Unfamiliar',
    angleDeg: 112.5, // Lower-Mid Right
  },
  {
    stage: 4,
    name: 'ADAPTS TO SITUATION',
    subtitle: 'Adapt to situation',
    shortName: 'Adapts',
    angleDeg: 157.5, // Bottom Right
  },
  {
    stage: 5,
    name: 'OVERCOMES (GETS WHAT THEY WANT)',
    subtitle: 'Get what they want',
    shortName: 'Overcomes',
    angleDeg: 202.5, // Bottom Left
  },
  {
    stage: 6,
    name: 'PAYS THE HEAVY PRICE',
    subtitle: 'Pay Heavy Price',
    shortName: 'Heavy Price',
    angleDeg: 247.5, // Lower-Mid Left
  },
  {
    stage: 7,
    name: 'RETURNS TO FAMILIAR SITUATION',
    subtitle: 'Return to familiar situation (zone of comfort)',
    shortName: 'Returns',
    angleDeg: 292.5, // Upper-Mid Left
  },
  {
    stage: 8,
    name: 'CHANGES AS A RESULT OF JOURNEY',
    subtitle: 'Changed as a result of Journey',
    shortName: 'Changes',
    angleDeg: 337.5, // Upper Left
  },
];

// Explanations tailored to each of the 3 Acts
const STAGE_EXPLANATIONS = {
  // ACT 1: THE BEGINNING
  '1.1': 'Introduces the protagonist in their ordinary world, current circumstances, and baseline status quo.',
  '1.2': 'An inciting spark or internal dilemma causes the protagonist to want or believe they need something new.',
  '1.3': 'The protagonist steps across the initial threshold into unfamiliar territory or encounters their first major test.',
  '1.4': 'They learn the preliminary ropes, develop new approaches, and adapt to early friction.',
  '1.5': 'They achieve their first meaningful victory or objective, securing an early win.',
  '1.6': 'An unforeseen price or conflict arises from their actions, escalating the stakes.',
  '1.7': 'They attempt to retreat to their familiar comfort zone, but realize they cannot turn back.',
  '1.8': 'The protagonist undergoes an irreversible shift, firmly launching into the broader journey of Act 2.',

  // ACT 2: THE MIDDLE
  '2.1': 'A temporary new comfort zone is established inside the special or unfamiliar world.',
  '2.2': 'The protagonist locks onto the primary mission or high-stakes mid-story goal.',
  '2.3': 'Deeper immersion into hostile, complicated, or intensely competitive territory.',
  '2.4': 'Adapting under intense pressure: learning critical skills, building alliances, and overcoming major roadblocks.',
  '2.5': 'The Midpoint breakthrough: The protagonist achieves a major triumph or crucial revelation.',
  '2.6': 'The All Hope Is Lost crisis: Facing the heaviest consequence, sacrifice, betrayal, or near-defeat.',
  '2.7': 'Regrouping in the aftermath: Coming to terms with the sacrifice and refocusing perspective.',
  '2.8': 'Recommitting with clarity and forged resolve, preparing for the ultimate showdown in Act 3.',

  // ACT 3: THE CLIMAX
  '3.1': 'The calm before the storm: Preparing the battleground, final resources, and rallying allies.',
  '3.2': 'The ultimate, singular objective: Defeat the central antagonistic force and resolve the story problem.',
  '3.3': 'Breaching the lion’s den: The final confrontation begins in the most perilous environment.',
  '3.4': 'The Climax: Synthesizing everything learned throughout the journey to navigate the supreme test.',
  '3.5': 'Decisive triumph: The protagonist overcomes the central conflict through courage and truth.',
  '3.6': 'The personal or emotional toll paid to ensure lasting victory and closure.',
  '3.7': 'Returning home or standing in the newly transformed reality with enlightened perspective.',
  '3.8': 'The Master of Two Worlds: The protagonist’s journey is complete; a new normal is permanently established.',
};

/**
 * Generate the 24 divisions specification (8 in Act 1, 8 in Act 2, 8 in Act 3)
 */
export function buildExpandedDivisionsSpec() {
  const acts = [
    {
      act: 'ACT 1',
      actTitle: 'ACT 1 - GREEN: THE BEGINNING',
      prefix: '1',
      color: '#22C55E',
      layerName: 'Layer 1 – Outer Circle: GREEN',
    },
    {
      act: 'ACT 2',
      actTitle: 'ACT 2 - YELLOW: THE MIDDLE',
      prefix: '2',
      color: '#FACC15',
      layerName: 'Layer 2 – Second Circle: YELLOW',
    },
    {
      act: 'ACT 3',
      actTitle: 'ACT 3 - RED: THE CLIMAX',
      prefix: '3',
      color: '#EF4444',
      layerName: 'Layer 3 – Third Circle: RED',
    },
  ];

  const list = [];
  acts.forEach((actInfo) => {
    CORE_8_STAGES.forEach((stageInfo) => {
      const code = `${actInfo.prefix}.${stageInfo.stage}`;
      list.push({
        id: code,
        code,
        number: code,
        act: actInfo.act,
        actTitle: actInfo.actTitle,
        stage: stageInfo.stage,
        stageName: stageInfo.name,
        title: `${code} ${stageInfo.name}`,
        subtitle: stageInfo.subtitle,
        shortName: stageInfo.shortName,
        color: actInfo.color,
        layer: actInfo.layerName,
        angleDeg: stageInfo.angleDeg,
        explanation: STAGE_EXPLANATIONS[code] || stageInfo.subtitle,
      });
    });
  });

  return list;
}

export const STORY_CIRCLE_DIVISIONS_SPEC = buildExpandedDivisionsSpec();

/**
 * Create a fresh default Story Circle object (24 divisions across 3 acts + The End)
 */
export function createDefaultStoryCircle(title = 'Dan Harmon Expanded Story Circle') {
  return {
    title: 'Dan Harmon Expanded Story Circle',
    tagline: 'Feeling stuck? Craft a Plot.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    layers: STORY_CIRCLE_LAYERS.map((layer) => ({ ...layer })),
    divisions: STORY_CIRCLE_DIVISIONS_SPEC.map((spec) => ({
      id: spec.id,
      code: spec.code,
      number: spec.number || spec.code,
      act: spec.act,
      actTitle: spec.actTitle,
      stage: spec.stage,
      stageName: spec.stageName,
      title: spec.title,
      subtitle: spec.subtitle,
      shortName: spec.shortName,
      color: spec.color,
      layer: spec.layer,
      angleDeg: spec.angleDeg,
      explanation: spec.explanation,
      description: '',
      characterActions: '',
      importantEvents: '',
      completed: false,
    })),
    theEndNotes: '',
    progress: {
      completedCount: 0,
      totalCount: 24,
      percentage: 0,
      formatted: 'Story progress: 0/24 completed – 0%',
    },
  };
}

/**
 * Calculate progress statistics across all 24 story divisions
 */
export function calculateStoryProgress(divisions = []) {
  if (!Array.isArray(divisions)) {
    return { completedCount: 0, totalCount: 24, percentage: 0, formatted: 'Story progress: 0/24 completed – 0%' };
  }
  const completedCount = divisions.filter((d) => d && Boolean(d.completed)).length;
  const totalCount = 24;
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

  // Map existing divisions by code or numeric id
  const rawMap = {};
  if (Array.isArray(rawStoryCircle.divisions)) {
    rawStoryCircle.divisions.forEach((div) => {
      if (div) {
        if (typeof div.id === 'string') {
          rawMap[div.id] = div;
        } else if (typeof div.code === 'string') {
          rawMap[div.code] = div;
        } else if (typeof div.id === 'number') {
          // Backward compatibility for legacy 8 divisions format (maps 1..8 to Act 1 1.1..1.8)
          rawMap[`1.${div.id}`] = div;
        }
      }
    });
  }

  const sanitizedDivisions = STORY_CIRCLE_DIVISIONS_SPEC.map((spec) => {
    const existing = rawMap[spec.id] || {};
    return {
      id: spec.id,
      code: spec.code,
      number: spec.number || spec.code,
      act: spec.act,
      actTitle: spec.actTitle,
      stage: spec.stage,
      stageName: spec.stageName,
      title: spec.title,
      subtitle: spec.subtitle,
      shortName: spec.shortName,
      color: spec.color,
      layer: spec.layer,
      angleDeg: spec.angleDeg,
      explanation: spec.explanation,
      description: typeof existing.description === 'string' ? existing.description : '',
      characterActions: typeof existing.characterActions === 'string' ? existing.characterActions : '',
      importantEvents: typeof existing.importantEvents === 'string' ? existing.importantEvents : '',
      completed: Boolean(existing.completed),
    };
  });

  const progress = calculateStoryProgress(sanitizedDivisions);

  return {
    title: 'Dan Harmon Expanded Story Circle',
    tagline: 'Feeling stuck? Craft a Plot.',
    createdAt: rawStoryCircle.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    layers: STORY_CIRCLE_LAYERS.map((layer) => ({ ...layer })),
    divisions: sanitizedDivisions,
    theEndNotes: typeof rawStoryCircle.theEndNotes === 'string' ? rawStoryCircle.theEndNotes : '',
    progress,
  };
}
