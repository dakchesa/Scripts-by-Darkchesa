/**
 * Dan Harmon Expanded Story Circle - PDF Export Service
 * Scripts by Darkchesa - "Plot a Plot"
 *
 * Exports an independent PDF document containing:
 * 1. Document title: Dan Harmon Expanded Story Circle
 * 2. Complete coloured circular chart with 4 layers and 24 divisions (1.1-1.8, 2.1-2.8, 3.1-3.8)
 * 3. Act 1 - GREEN: THE BEGINNING (1.1 - 1.8)
 * 4. Act 2 - YELLOW: THE MIDDLE (2.1 - 2.8)
 * 5. Act 3 - RED: THE CLIMAX (3.1 - 3.8)
 * 6. THE END: Central Resolution
 * 7. Prompts user where to store on device and returns location
 */

import Platform from '../utils/platform.js';
import { calculateStoryProgress, CORE_8_STAGES } from '../types/storyCircle.js';

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getFileSystem() {
  try {
    return require('expo-file-system');
  } catch (e) {
    return null;
  }
}

function getReadableDeviceLocation(uri = '') {
  if (!uri) return 'Device Storage';
  try {
    const decoded = decodeURIComponent(uri);
    if (decoded.includes('primary:')) {
      const sub = decoded.split('primary:')[1];
      return `Internal Storage > ${sub || 'Documents'}`;
    }
    if (decoded.includes('document/')) {
      const parts = decoded.split('document/')[1];
      return `Device Storage > ${parts}`;
    }
    const clean = decoded.replace(/^file:\/\//, '');
    return clean;
  } catch (e) {
    return uri;
  }
}

async function askSavePermission(filename, targetLocation) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm) {
      return window.confirm(
        `Export Dan Harmon Expanded Story Circle PDF?\n\nFile: ${filename}\nLocation: ${targetLocation}\n\nClick OK to confirm export and download.`
      );
    }
    return true;
  }
  return true;
}

/**
 * Generate full SVG string for the Expanded Story Circle chart
 */
export function generateExpandedStoryCircleSvgHtml(divisions = [], size = 380) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 420;

  const rOuter = 185 * scale;  // Green (Act 1)
  const rMiddle = 135 * scale; // Yellow (Act 2)
  const rInner = 86 * scale;   // Red (Act 3)
  const rCenter = 42 * scale;  // Pink (The End)

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

  const rings = [
    { prefix: '1', rBadge: 160 * scale, radius: 13.5 * scale },
    { prefix: '2', rBadge: 110 * scale, radius: 13 * scale },
    { prefix: '3', rBadge: 64 * scale, radius: 12.5 * scale },
  ];

  let badgesHtml = '';
  rings.forEach((ring) => {
    CORE_8_STAGES.forEach((stage) => {
      const code = `${ring.prefix}.${stage.stage}`;
      const pos = getCoordinates(ring.rBadge, stage.angleDeg);
      const div = divisions.find((d) => d.id === code) || {};
      const completed = Boolean(div.completed);
      const fill = completed ? '#15803D' : '#FFFFFF';
      const textFill = completed ? '#FFFFFF' : '#0F172A';
      const textContent = completed ? '&#10003;' : code;

      badgesHtml += `
        <circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="${ring.radius.toFixed(1)}" fill="${fill}" stroke="#0F172A" stroke-width="2" />
        <text x="${pos.x.toFixed(1)}" y="${(pos.y + 3.5 * scale).toFixed(1)}" fill="${textFill}" font-size="${(9.5 * scale).toFixed(1)}" font-weight="bold" font-family="'Courier New', monospace" text-anchor="middle">${textContent}</text>
      `;
    });
  });

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="margin: 0 auto; display: block;">
      <!-- Layer 1: Outer Circle (GREEN - Act 1: The Beginning) -->
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#22C55E" stroke="#0F172A" stroke-width="3" />
      <!-- Layer 2: Second Circle (YELLOW - Act 2: The Middle) -->
      <circle cx="${cx}" cy="${cy}" r="${rMiddle}" fill="#FACC15" stroke="#0F172A" stroke-width="3" />
      <!-- Layer 3: Third Circle (RED - Act 3: The Climax) -->
      <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="#EF4444" stroke="#0F172A" stroke-width="3" />
      <!-- Radial Spokes -->
      ${spokesHtml}
      <!-- Layer 4: Centre Circle (PINK - THE END) -->
      <circle cx="${cx}" cy="${cy}" r="${rCenter}" fill="#F472B6" stroke="#0F172A" stroke-width="3" />
      <text x="${cx}" y="${(cy - 2 * scale).toFixed(1)}" fill="#0F172A" font-size="${(11 * scale).toFixed(1)}" font-weight="bold" font-family="'Courier New', monospace" text-anchor="middle">THE</text>
      <text x="${cx}" y="${(cy + 11 * scale).toFixed(1)}" fill="#0F172A" font-size="${(11 * scale).toFixed(1)}" font-weight="bold" font-family="'Courier New', monospace" text-anchor="middle">END</text>
      <!-- All 24 Badges in Their Rings -->
      ${badgesHtml}
    </svg>
  `;
}

/**
 * Generate complete HTML for Dan Harmon Expanded Story Circle PDF
 */
export function generateExpandedStoryCircleHtml(scriptTitle = 'Screenplay', storyCircle) {
  const divisions = storyCircle?.divisions || [];
  const progress = calculateStoryProgress(divisions);
  const svgHtml = generateExpandedStoryCircleSvgHtml(divisions, 310);

  // Group divisions into Acts in strict required order:
  // Act 1 (1.1 - 1.8), Act 2 (2.1 - 2.8), Act 3 (3.1 - 3.8)
  const act1Divisions = divisions.filter((d) => d.act === 'ACT 1');
  const act2Divisions = divisions.filter((d) => d.act === 'ACT 2');
  const act3Divisions = divisions.filter((d) => d.act === 'ACT 3');

  const renderActTable = (actDivisions, actClass, thClass) => `
    <table class="act-table ${actClass}">
      <thead>
        <tr>
          <th class="${thClass}" style="width: 20%;">STAGE &amp; OBJECTIVE</th>
          <th class="${thClass}" style="width: 33%;">STORY DESCRIPTION</th>
          <th class="${thClass}" style="width: 24%;">CHARACTER ACTIONS</th>
          <th class="${thClass}" style="width: 14%;">KEY EVENTS</th>
          <th class="${thClass}" style="width: 9%; text-align: center;">STATUS</th>
        </tr>
      </thead>
      <tbody>
        ${actDivisions.map((d) => `
          <tr class="${d.completed ? 'completed-row' : ''}">
            <td class="cell-stage">
              <span class="stage-code-badge" style="background-color: ${d.color};">${d.code}</span>
              <div class="stage-name">${escapeHtml(d.stageName || d.title)}</div>
              <div class="stage-subtitle">${escapeHtml(d.subtitle || '')}</div>
              <div class="stage-expl">${escapeHtml(d.explanation || '')}</div>
            </td>
            <td class="cell-desc">
              ${escapeHtml(d.description || '—')}
            </td>
            <td class="cell-actions">
              ${escapeHtml(d.characterActions || '—')}
            </td>
            <td class="cell-events">
              ${escapeHtml(d.importantEvents || '—')}
            </td>
            <td class="cell-status" style="text-align: center;">
              <span class="status-badge ${d.completed ? 'badge-completed' : 'badge-pending'}">
                ${d.completed ? '&#10003; Done' : 'Pending'}
              </span>
            </td>
          </tr>
        `).join('\n')}
      </tbody>
    </table>
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Dan Harmon Expanded Story Circle - ${escapeHtml(scriptTitle)}</title>
        <style>
          @page {
            size: letter;
            margin: 0.42in 0.42in 0.42in 0.42in;
          }

          * { box-sizing: border-box; }

          body {
            font-family: "Courier New", Courier, monospace;
            color: #0F172A;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            line-height: 1.28;
            font-size: 7.5pt;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #0F172A;
            padding-bottom: 7px;
            margin-bottom: 9px;
          }

          .doc-title {
            font-size: 16pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            margin: 0 0 2px 0;
          }

          .script-title {
            font-size: 10.5pt;
            font-weight: bold;
            color: #334155;
            margin-top: 2px;
          }

          .tagline {
            font-size: 8.5pt;
            font-style: italic;
            color: #64748B;
            margin-top: 1px;
          }

          .first-page {
            page-break-after: always;
            break-after: page;
          }

          .chart-section {
            text-align: center;
            margin-bottom: 9px;
          }

          .legend-bar {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 7px;
            font-size: 8pt;
            font-weight: bold;
            flex-wrap: wrap;
          }

          .legend-item {
            display: inline-flex;
            align-items: center;
            margin: 0 4px;
          }

          .legend-color {
            display: inline-block;
            width: 13px;
            height: 9px;
            border: 1.5px solid #0F172A;
            margin-right: 4px;
            vertical-align: middle;
          }

          .progress-banner {
            background-color: #F8FAFC;
            border: 1.5px solid #CBD5E1;
            border-radius: 5px;
            padding: 6px 12px;
            margin-top: 7px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .progress-label {
            font-size: 8.5pt;
            font-weight: bold;
          }

          .progress-stat {
            font-size: 10pt;
            font-weight: 900;
            color: #16A34A;
          }

          .cover-overview-note {
            text-align: center;
            font-size: 8pt;
            font-style: italic;
            color: #64748B;
            margin-top: 8px;
          }

          /* Individual Act Pages – each act starts on its own page */
          .act-page {
            page-break-before: always;
            break-before: page;
            padding-top: 0;
            margin-top: 0;
          }

          /* Keep header + subnote together so they don't split from their label */
          .act-page-header-block {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 5px;
          }

          .act-header {
            font-size: 10.5pt;
            font-weight: 900;
            padding: 5px 8px;
            border-radius: 3px;
            margin-bottom: 2px;
            border-left: 5px solid #0F172A;
          }

          .act-header.act1 { background-color: rgba(34,197,94,0.18); border-left-color: #16A34A; }
          .act-header.act2 { background-color: rgba(250,204,21,0.22); border-left-color: #CA8A04; }
          .act-header.act3 { background-color: rgba(239,68,68,0.18); border-left-color: #DC2626; }
          .act-header.the-end { background-color: rgba(244,114,182,0.2); border-left-color: #DB2777; }

          .act-subnote {
            font-size: 7.5pt;
            color: #64748B;
            margin-bottom: 5px;
            padding-left: 3px;
          }

          /*
           * TABLE — no page-break-inside:avoid on the whole table;
           * that was causing blank pages. Rows are allowed to break
           * across pages naturally. Only the header row is kept together.
           */
          .act-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 7pt;
          }

          .act-table thead tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .act-table th {
            padding: 4px 5px;
            font-weight: 900;
            color: #0F172A;
            border: 1.5px solid #0F172A;
            font-size: 7pt;
            letter-spacing: 0.2px;
          }

          .act-table th.act1-th { background-color: rgba(34,197,94,0.28); }
          .act-table th.act2-th { background-color: rgba(250,204,21,0.32); }
          .act-table th.act3-th { background-color: rgba(239,68,68,0.25); }

          .act-table td {
            border: 1px solid #CBD5E1;
            padding: 3px 5px;
            vertical-align: top;
            font-size: 7pt;
            line-height: 1.28;
            word-break: break-word;
            overflow-wrap: break-word;
          }

          .act-table tr { orphans: 2; widows: 2; }
          .act-table tr:nth-child(even) { background-color: #F8FAFC; }
          .act-table tr.completed-row { background-color: #F0FDF4; }

          .stage-code-badge {
            display: inline-block;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: 900;
            font-size: 7pt;
            color: #0F172A;
            border: 1px solid #0F172A;
            margin-bottom: 2px;
          }

          .stage-name { font-weight: bold; font-size: 7pt; color: #0F172A; margin-bottom: 1px; }
          .stage-subtitle { font-size: 6.5pt; color: #475569; margin-bottom: 1px; }
          .stage-expl { font-size: 6pt; font-style: italic; color: #64748B; line-height: 1.2; }

          .cell-desc  { font-size: 7pt; color: #0F172A; word-break: break-word; }
          .cell-actions { font-size: 6.5pt; color: #334155; word-break: break-word; }
          .cell-events  { font-size: 6.5pt; color: #334155; word-break: break-word; }

          .status-badge {
            display: inline-block;
            font-size: 6.5pt;
            font-weight: bold;
            padding: 1px 4px;
            border-radius: 3px;
            white-space: nowrap;
          }

          .badge-completed { background-color: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; }
          .badge-pending   { background-color: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; }

          .the-end-box {
            border: 2px solid #F472B6;
            background-color: #FDF2F8;
            border-radius: 6px;
            padding: 10px;
            margin-top: 10px;
            margin-bottom: 12px;
          }

          .the-end-title { font-size: 12pt; font-weight: 900; color: #BE185D; margin-bottom: 6px; }
          .the-end-text  { font-size: 9pt; line-height: 1.4; color: #0F172A; word-break: break-word; }

          .end-summary-grid { display: flex; gap: 10px; margin-top: 10px; }

          .end-summary-card {
            flex: 1;
            background-color: #FFFFFF;
            border: 1.5px solid #CBD5E1;
            border-radius: 5px;
            padding: 8px;
          }

          .end-summary-label { font-size: 7pt; font-weight: bold; color: #64748B; }
          .end-summary-val   { font-size: 10pt; font-weight: 900; color: #0F172A; margin-top: 2px; }

          .footer {
            text-align: center;
            font-size: 7.5pt;
            color: #94A3B8;
            margin-top: 16px;
            border-top: 1px solid #E2E8F0;
            padding-top: 7px;
          }
        </style>
      </head>
      <body>
        <!-- PAGE 1: STORY CIRCLE OVERVIEW & CIRCULAR CHART -->
        <div class="first-page">
          <div class="header">
            <h1 class="doc-title">DAN HARMON EXPANDED STORY CIRCLE</h1>
            <div class="script-title">${escapeHtml(scriptTitle.toUpperCase())}</div>
            <div class="tagline">Plot a Plot &bull; Feeling stuck? Craft a Plot.</div>
          </div>

          <!-- Circular Vector Chart -->
          <div class="chart-section">
            ${svgHtml}
            <div class="legend-bar">
              <span class="legend-item"><span class="legend-color" style="background:#22C55E;"></span> Act 1: The Beginning (1.1 - 1.8)</span>
              <span class="legend-item"><span class="legend-color" style="background:#FACC15;"></span> Act 2: The Middle (2.1 - 2.8)</span>
              <span class="legend-item"><span class="legend-color" style="background:#EF4444;"></span> Act 3: The Climax (3.1 - 3.8)</span>
              <span class="legend-item"><span class="legend-color" style="background:#F472B6;"></span> The End</span>
            </div>
          </div>

          <!-- Progress Summary -->
          <div class="progress-banner">
            <span class="progress-label">EXPANDED STORY CIRCLE PROGRESS:</span>
            <span class="progress-stat">${progress.completedCount} of 24 Divisions Completed (${progress.percentage}%)</span>
          </div>

          <div class="cover-overview-note">
            Tabular breakdowns for Act 1 (The Beginning), Act 2 (The Middle), Act 3 (The Climax), and The End follow on dedicated pages.
          </div>
        </div>

        <!-- PAGE 2: ACT 1 - GREEN: THE BEGINNING (1.1 - 1.8) -->
        <div class="act-page">
          <div class="act-page-header-block">
            <div class="act-header act1">ACT 1 &ndash; GREEN: THE BEGINNING (1.1 &ndash; 1.8)</div>
            <div class="act-subnote">Outer Circle (Green) &bull; Character establishment, ordinary world status quo, and the initial journey threshold.</div>
          </div>
          ${renderActTable(act1Divisions, 'act1-table', 'act1-th')}
        </div>

        <!-- PAGE 3: ACT 2 - YELLOW: THE MIDDLE (2.1 - 2.8) -->
        <div class="act-page">
          <div class="act-page-header-block">
            <div class="act-header act2">ACT 2 &ndash; YELLOW: THE MIDDLE (2.1 &ndash; 2.8)</div>
            <div class="act-subnote">Second Circle (Yellow) &bull; Rising trials, unfamiliar territory, midpoint breakthrough, and crisis.</div>
          </div>
          ${renderActTable(act2Divisions, 'act2-table', 'act2-th')}
        </div>

        <!-- PAGE 4: ACT 3 - RED: THE CLIMAX (3.1 - 3.8) -->
        <div class="act-page">
          <div class="act-page-header-block">
            <div class="act-header act3">ACT 3 &ndash; RED: THE CLIMAX (3.1 &ndash; 3.8)</div>
            <div class="act-subnote">Third Circle (Red) &bull; Final confrontation, decisive adaptation, heavy sacrifice, and master transformation.</div>
          </div>
          ${renderActTable(act3Divisions, 'act3-table', 'act3-th')}
        </div>

        <!-- PAGE 5: THE END - CENTRAL RESOLUTION -->
        <div class="act-page">
          <div class="act-page-header-block">
            <div class="act-header the-end">THE END &ndash; CENTRAL RESOLUTION</div>
            <div class="act-subnote">Centre Circle (PINK) &bull; The ultimate destination, final thematic resolution, and the permanent new normal.</div>
          </div>
          <div class="the-end-box">
            <div class="the-end-title">&#9679; THE END &ndash; CENTRAL RESOLUTION</div>
            <div class="the-end-text">
              ${escapeHtml(storyCircle?.theEndNotes || 'The protagonist has traversed the full expanded 3-act circle, arriving back at the center: transformed, resolved, and establishing the permanent new normal.')}
            </div>
          </div>

          <div class="end-summary-grid">
            <div class="end-summary-card">
              <div class="end-summary-label">TOTAL DIVISIONS</div>
              <div class="end-summary-val">24 Stages</div>
            </div>
            <div class="end-summary-card">
              <div class="end-summary-label">COMPLETED STAGES</div>
              <div class="end-summary-val" style="color: #16A34A;">${progress.completedCount} / 24 (${progress.percentage}%)</div>
            </div>
            <div class="end-summary-card">
              <div class="end-summary-label">ACT BREAKDOWNS</div>
              <div class="end-summary-val">3 Acts + Centre</div>
            </div>
          </div>

          <div class="footer">
            Generated with Scripts by Darkchesa &bull; Dan Harmon Expanded Story Circle &bull; ${new Date().toLocaleDateString()}
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Export Dan Harmon Expanded Story Circle to standalone PDF,
 * asking user where to store the file and returning device location
 */
export async function exportStoryCirclePDF(scriptTitle = 'Screenplay', storyCircle) {
  const safeTitle = (scriptTitle || 'Screenplay').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${safeTitle}_Expanded_Story_Circle.pdf`;
  const html = generateExpandedStoryCircleHtml(scriptTitle, storyCircle);

  // ================= WEB PLATFORM =================
  if (Platform.OS === 'web') {
    const targetLocation = `Device Downloads / ${filename}`;
    const hasPermission = await askSavePermission(filename, targetLocation);
    if (!hasPermission) {
      return { success: false, cancelled: true };
    }

    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);

      // Trigger automatic file download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${safeTitle}_Expanded_Story_Circle.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Print dialog for PDF generation
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
        location: targetLocation,
        blobUrl,
        type: 'pdf',
        title: 'Dan Harmon Expanded Story Circle',
      };
    } catch (err) {
      console.warn('Web Story Circle export error:', err);
      return { success: false, error: err.message };
    }
  }

  // ================= NATIVE MOBILE (ANDROID & IOS) =================
  try {
    const FileSystem = getFileSystem();
    const Print = require('expo-print');

    // 1. Android Scoped Storage / Storage Access Framework (prompt user to choose folder)
    if (Platform.OS === 'android' && FileSystem?.StorageAccessFramework) {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const directoryUri = permissions.directoryUri;
        const readableFolder = getReadableDeviceLocation(directoryUri);

        const pdfResult = await Print.printToFileAsync({
          html,
          base64: true,
        });

        const createdFileUri =
          await FileSystem.StorageAccessFramework.createFileAsync(
            directoryUri,
            filename,
            'application/pdf'
          );

        await FileSystem.writeAsStringAsync(createdFileUri, pdfResult.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fullLocation = `${readableFolder} / ${filename}`;

        return {
          success: true,
          location: fullLocation,
          fileUri: pdfResult.uri || createdFileUri,
          filename,
          type: 'pdf',
          title: 'Dan Harmon Expanded Story Circle',
        };
      }
    }

    // 2. iOS and Android fallback (App Documents Directory)
    const docDir = FileSystem?.documentDirectory || '';
    const targetPath = `${docDir}${filename}`;
    const readableLocation = getReadableDeviceLocation(targetPath);

    const pdfResult = await Print.printToFileAsync({
      html,
      base64: false,
    });

    if (FileSystem?.copyAsync) {
      try {
        await FileSystem.copyAsync({
          from: pdfResult.uri,
          to: targetPath,
        });
      } catch (copyErr) {
        console.warn('Could not copy to documents directory:', copyErr);
      }
    }

    const shareUri = targetPath || pdfResult.uri;

    return {
      success: true,
      location: readableLocation,
      fileUri: shareUri,
      filename,
      type: 'pdf',
      title: 'Dan Harmon Expanded Story Circle',
    };
  } catch (err) {
    console.error('Story Circle mobile PDF export error:', err);
    return { success: false, error: err.message };
  }
}

// Aliases for compatibility
export const generateStoryCircleSvgHtml = generateExpandedStoryCircleSvgHtml;
export const generateStoryCircleHtml = generateExpandedStoryCircleHtml;
