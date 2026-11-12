/**
 * Dan Harmon Story Circle - PDF Export Service
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Exports an independent PDF document containing:
 * 1. Document title: Dan Harmon Story Circle (and screenplay title)
 * 2. Complete coloured circular chart with the four layers and 8 divisions
 * 3. All eight story division titles & numbers
 * 4. User's written descriptions, character actions, and important events
 * 5. Three act explanations (Act 1, Act 2, Act 3)
 * 6. Story completion indicators & checkboxes
 * 7. Overall progress summary
 */

import Platform from '../utils/platform.js';
import { calculateStoryProgress } from '../types/storyCircle.js';

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate full SVG string for the circular chart in HTML/PDF
 */
export function generateStoryCircleSvgHtml(divisions = [], size = 360) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 400;
  const rOuter = 160 * scale;
  const rMiddle = 115 * scale;
  const rInner = 72 * scale;
  const rCenter = 36 * scale;

  const spokeAnglesDeg = [0, 45, 90, 135, 180, 225, 270, 315];

  const getCoordinates = (radius, angleDegrees) => {
    const angleRad = (angleDegrees - 90) * (Math.PI / 180);
    return {
      x: cx + radius * Math.cos(angleRad),
      y: cy + radius * Math.sin(angleRad),
    };
  };

  const spokesHtml = spokeAnglesDeg
    .map((deg) => {
      const s = getCoordinates(rCenter, deg);
      const e = getCoordinates(rOuter, deg);
      return `<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${e.y.toFixed(1)}" stroke="#0F172A" stroke-width="2.5" />`;
    })
    .join('\n');

  const divisionPlacements = [
    { id: 1, angleDeg: 22.5, r: 137.5 * scale },
    { id: 2, angleDeg: 67.5, r: 93.5 * scale },
    { id: 3, angleDeg: 112.5, r: 54 * scale },
    { id: 4, angleDeg: 157.5, r: 54 * scale },
    { id: 5, angleDeg: 202.5, r: 54 * scale },
    { id: 6, angleDeg: 247.5, r: 54 * scale },
    { id: 7, angleDeg: 292.5, r: 93.5 * scale },
    { id: 8, angleDeg: 337.5, r: 137.5 * scale },
  ];

  const badgesHtml = divisionPlacements
    .map((p) => {
      const pos = getCoordinates(p.r, p.angleDeg);
      const div = divisions.find((d) => d.id === p.id) || {};
      const completed = Boolean(div.completed);
      const fill = completed ? '#15803D' : '#FFFFFF';
      const textFill = completed ? '#FFFFFF' : '#0F172A';
      const textContent = completed ? '&#10003;' : p.id;

      return `
        <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${(14 * scale).toFixed(1)}" fill="${fill}" stroke="#0F172A" stroke-width="2" />
        <text x="${pos.x.toFixed(1)}" y="${(pos.y + 4.5 * scale).toFixed(1)}" fill="${textFill}" font-size="${(13 * scale).toFixed(1)}" font-weight="bold" font-family="'Courier New', monospace" text-anchor="middle">${textContent}</text>
      `;
    })
    .join('\n');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="margin: 0 auto; display: block;">
      <!-- Layer 1: Outer Circle (GREEN - Act 1) -->
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#22C55E" stroke="#0F172A" stroke-width="3" />
      <!-- Layer 2: Second Circle (YELLOW - Act 2) -->
      <circle cx="${cx}" cy="${cy}" r="${rMiddle}" fill="#FACC15" stroke="#0F172A" stroke-width="3" />
      <!-- Layer 3: Third Circle (RED - Act 3) -->
      <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="#EF4444" stroke="#0F172A" stroke-width="3" />
      <!-- Radial Spokes -->
      ${spokesHtml}
      <!-- Layer 4: Centre Circle (PINK - THE END) -->
      <circle cx="${cx}" cy="${cy}" r="${rCenter}" fill="#F472B6" stroke="#0F172A" stroke-width="3" />
      <text x="${cx}" y="${(cy - 2 * scale).toFixed(1)}" fill="#0F172A" font-size="${(11 * scale).toFixed(1)}" font-weight="bold" font-family="'Courier New', monospace" text-anchor="middle">THE</text>
      <text x="${cx}" y="${(cy + 11 * scale).toFixed(1)}" fill="#0F172A" font-size="${(11 * scale).toFixed(1)}" font-weight="bold" font-family="'Courier New', monospace" text-anchor="middle">END</text>
      <!-- Division Badges -->
      ${badgesHtml}
    </svg>
  `;
}

/**
 * Generate full HTML document for the Dan Harmon Story Circle PDF
 */
export function generateStoryCircleHtml(scriptTitle = 'Screenplay', storyCircle) {
  const divisions = storyCircle?.divisions || [];
  const progress = calculateStoryProgress(divisions);
  const svgHtml = generateStoryCircleSvgHtml(divisions, 340);

  // Group divisions into Acts
  const act1Divisions = divisions.filter((d) => d.act === 'ACT 1'); // 1 & 8
  const act2Divisions = divisions.filter((d) => d.act === 'ACT 2'); // 2 & 7
  const act3Divisions = divisions.filter((d) => d.act === 'ACT 3'); // 3, 4, 5, 6

  const renderDivisionCard = (d) => `
    <div class="division-card ${d.completed ? 'completed' : ''}">
      <div class="division-header">
        <span class="division-number" style="background-color: ${d.color};">${d.number}</span>
        <span class="division-title">${escapeHtml(d.title)}</span>
        <span class="status-badge ${d.completed ? 'badge-completed' : 'badge-pending'}">
          ${d.completed ? '&#10003; WRITTEN IN SCRIPT' : 'PENDING'}
        </span>
      </div>
      <div class="division-explanation">${escapeHtml(d.explanation)}</div>
      
      <div class="division-field">
        <div class="field-label">STORY DESCRIPTION:</div>
        <div class="field-content">${escapeHtml(d.description || 'No description entered yet.')}</div>
      </div>

      ${d.characterActions ? `
      <div class="division-field">
        <div class="field-label">CHARACTER ACTIONS:</div>
        <div class="field-content">${escapeHtml(d.characterActions)}</div>
      </div>` : ''}

      ${d.importantEvents ? `
      <div class="division-field">
        <div class="field-label">IMPORTANT EVENTS / DISCOVERIES:</div>
        <div class="field-content">${escapeHtml(d.importantEvents)}</div>
      </div>` : ''}
    </div>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Dan Harmon Story Circle - ${escapeHtml(scriptTitle)}</title>
        <style>
          @page {
            size: letter;
            margin: 0.8in 0.8in 0.8in 0.8in;
            @top-right {
              content: "Scripts by Darkchesa";
              font-family: "Courier New", Courier, monospace;
              font-size: 9pt;
              color: #64748B;
            }
          }

          body {
            font-family: "Courier New", Courier, monospace;
            color: #0F172A;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            line-height: 1.4;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #0F172A;
            padding-bottom: 14px;
            margin-bottom: 20px;
          }

          .doc-title {
            font-size: 24pt;
            font-weight: 900;
            letter-spacing: 1px;
            margin: 0;
          }

          .script-title {
            font-size: 14pt;
            font-weight: bold;
            color: #475569;
            margin-top: 4px;
          }

          .tagline {
            font-size: 11pt;
            font-style: italic;
            color: #64748B;
            margin-top: 2px;
          }

          .chart-section {
            text-align: center;
            margin-bottom: 24px;
            page-break-inside: avoid;
          }

          .legend-bar {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 14px;
            font-size: 11pt;
            font-weight: bold;
          }

          .legend-item {
            display: inline-flex;
            align-items: center;
            margin: 0 10px;
          }

          .legend-color {
            display: inline-block;
            width: 20px;
            height: 12px;
            border: 1.5px solid #0F172A;
            margin-right: 6px;
            vertical-align: middle;
          }

          .progress-banner {
            background-color: #F8FAFC;
            border: 2px solid #E2E8F0;
            border-radius: 8px;
            padding: 12px 18px;
            margin-bottom: 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            page-break-inside: avoid;
          }

          .progress-label {
            font-size: 12pt;
            font-weight: bold;
          }

          .progress-stat {
            font-size: 14pt;
            font-weight: 900;
            color: #16A34A;
          }

          .act-section {
            margin-bottom: 28px;
            page-break-inside: avoid;
          }

          .act-header {
            font-size: 14pt;
            font-weight: 900;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 12px;
            border-left: 8px solid #0F172A;
          }

          .act-header.act1 {
            background-color: rgba(34, 197, 94, 0.18);
            border-left-color: #16A34A;
          }

          .act-header.act2 {
            background-color: rgba(250, 204, 21, 0.22);
            border-left-color: #CA8A04;
          }

          .act-header.act3 {
            background-color: rgba(239, 68, 68, 0.18);
            border-left-color: #DC2626;
          }

          .division-card {
            border: 1.5px solid #CBD5E1;
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 14px;
            background-color: #FFFFFF;
            page-break-inside: avoid;
          }

          .division-card.completed {
            border-color: #22C55E;
            background-color: #F0FDF4;
          }

          .division-header {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }

          .division-number {
            display: inline-block;
            width: 26px;
            height: 26px;
            border-radius: 13px;
            text-align: center;
            line-height: 26px;
            font-weight: 900;
            color: #0F172A;
            border: 1.5px solid #0F172A;
            margin-right: 10px;
          }

          .division-title {
            font-size: 12pt;
            font-weight: bold;
            flex-grow: 1;
          }

          .status-badge {
            font-size: 9pt;
            font-weight: bold;
            padding: 3px 8px;
            border-radius: 4px;
            float: right;
          }

          .badge-completed {
            background-color: #DCFCE7;
            color: #15803D;
            border: 1px solid #86EFAC;
          }

          .badge-pending {
            background-color: #F1F5F9;
            color: #64748B;
            border: 1px solid #CBD5E1;
          }

          .division-explanation {
            font-size: 10pt;
            font-style: italic;
            color: #475569;
            margin-bottom: 10px;
            padding-left: 36px;
          }

          .division-field {
            margin-top: 8px;
            padding-left: 36px;
          }

          .field-label {
            font-size: 9pt;
            font-weight: bold;
            color: #64748B;
            letter-spacing: 0.5px;
          }

          .field-content {
            font-size: 11pt;
            color: #0F172A;
            margin-top: 2px;
            white-space: pre-wrap;
          }

          .footer {
            text-align: center;
            font-size: 9pt;
            color: #94A3B8;
            margin-top: 30px;
            border-top: 1px solid #E2E8F0;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="doc-title">DAN HARMON STORY CIRCLE</h1>
          <div class="script-title">${escapeHtml(scriptTitle.toUpperCase())}</div>
          <div class="tagline">Plot a Plot &bull; Feeling stuck? Craft a Plot.</div>
        </div>

        <!-- Circular Vector Chart -->
        <div class="chart-section">
          ${svgHtml}
          <div class="legend-bar">
            <span class="legend-item"><span class="legend-color" style="background:#22C55E;"></span> Act 1</span>
            <span class="legend-item"><span class="legend-color" style="background:#FACC15;"></span> Act 2</span>
            <span class="legend-item"><span class="legend-color" style="background:#EF4444;"></span> Act 3</span>
            <span class="legend-item"><span class="legend-color" style="background:#F472B6;"></span> The End</span>
          </div>
        </div>

        <!-- Progress Summary -->
        <div class="progress-banner">
          <span class="progress-label">SCREENPLAY STORY PROGRESS:</span>
          <span class="progress-stat">${progress.completedCount} of 8 Divisions Completed (${progress.percentage}%)</span>
        </div>

        <!-- ACT 1 -->
        <div class="act-section">
          <div class="act-header act1">ACT 1 &ndash; GREEN: THE BEGINNING (Story Points 1 &amp; 8)</div>
          ${act1Divisions.map(renderDivisionCard).join('\n')}
        </div>

        <!-- ACT 2 -->
        <div class="act-section">
          <div class="act-header act2">ACT 2 &ndash; YELLOW: THE JOURNEY (Story Points 2 &amp; 7)</div>
          ${act2Divisions.map(renderDivisionCard).join('\n')}
        </div>

        <!-- ACT 3 -->
        <div class="act-section">
          <div class="act-header act3">ACT 3 &ndash; RED: THE CONFLICT AND RESOLUTION (Story Points 3, 4, 5 &amp; 6)</div>
          ${act3Divisions.map(renderDivisionCard).join('\n')}
        </div>

        <div class="footer">
          Generated with Scripts by Darkchesa &bull; Dan Harmon Story Circle Structure &bull; ${new Date().toLocaleDateString()}
        </div>
      </body>
    </html>
  `;
}

/**
 * Export Dan Harmon Story Circle to standalone PDF
 */
export async function exportStoryCirclePDF(scriptTitle = 'Screenplay', storyCircle) {
  const html = generateStoryCircleHtml(scriptTitle, storyCircle);
  const safeTitle = (scriptTitle || 'Screenplay').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeTitle}_Story_Circle.pdf`;

  if (Platform.OS === 'web') {
    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      // Trigger print dialog via iframe for PDF rendering
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      iframe.contentDocument.write(html);
      iframe.contentDocument.close();
      iframe.contentWindow.focus();

      setTimeout(() => {
        try {
          iframe.contentWindow.print();
        } catch (e) {
          console.warn('Story circle print error:', e);
        }
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {}
        }, 1500);
      }, 400);

      return {
        success: true,
        filename,
        location: `Device Downloads / ${safeTitle}_Story_Circle.html`,
        blobUrl,
      };
    } catch (err) {
      console.warn('Web Story Circle export error:', err);
      return { success: false, error: err.message };
    }
  }

  // Native Mobile (Android & iOS)
  try {
    const Print = require('expo-print');
    const Sharing = require('expo-sharing');

    const pdfResult = await Print.printToFileAsync({
      html,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfResult.uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Share ${filename}`,
        UTI: 'com.adobe.pdf',
      });
    }

    return {
      success: true,
      filename,
      location: pdfResult.uri,
      fileUri: pdfResult.uri,
    };
  } catch (err) {
    console.error('Story Circle mobile PDF export error:', err);
    return { success: false, error: err.message };
  }
}
