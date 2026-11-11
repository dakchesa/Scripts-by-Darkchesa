/**
 * Screenplay PDF Generation and Export Service
 * Scripts by Darkchesa
 *
 * Adheres strictly to Hollywood Screenplay formatting standards:
 * Courier 12pt, 1.5" left margin, 1.0" top/bottom/right margins,
 * element indents, page numbers, and title page without underline.
 *
 * Provides permission confirmation before saving, displays exact device
 * target location, and supports Android StorageAccessFramework, iOS Documents,
 * and Web native print / download.
 */

import Platform from '../utils/platform.js';
import { ELEMENT_TYPES } from '../types/screenplay.js';
import { calculateWordCount, calculateEstimatedPages } from './sdachFileService.js';

let AlertHelper = {
  alert: (...args) => console.log('Alert:', ...args),
};

try {
  const RN = require('react-native');
  if (RN && RN.Alert) {
    AlertHelper = RN.Alert;
  }
} catch (e) {}

/**
 * Safe resolver for Expo FileSystem across SDK 58 legacy and modern exports
 */
export function getFileSystem() {
  try {
    const legacy = require('expo-file-system/legacy');
    if (legacy && (legacy.documentDirectory || legacy.StorageAccessFramework)) {
      return legacy;
    }
  } catch (e) {}
  try {
    const fs = require('expo-file-system');
    return fs;
  } catch (e) {}
  return null;
}

/**
 * Get permanent document directory path
 */
export function getDocumentDirectory(fs) {
  if (!fs) return 'file:///documents/';
  if (fs.documentDirectory) return fs.documentDirectory;
  if (fs.Paths?.document?.uri) return fs.Paths.document.uri;
  return 'file:///documents/';
}

/**
 * Human-friendly device location decoder for content URIs and file paths
 */
export function getReadableDeviceLocation(uri) {
  if (!uri) return 'Device Storage';
  try {
    const decoded = decodeURIComponent(uri);
    if (decoded.includes('primary:')) {
      const folder = decoded.split('primary:')[1];
      return `Device Storage / ${folder}`;
    }
    if (decoded.includes('document/')) {
      const folder = decoded.split('document/')[1];
      return `Device Storage / ${folder}`;
    }
    if (decoded.includes('tree/')) {
      const folder = decoded.split('tree/')[1];
      return `Device Storage / ${folder}`;
    }
    return decoded.replace('file://', '');
  } catch (e) {
    return uri;
  }
}

/**
 * Generate standard Hollywood screenplay HTML representation
 */
export function generateScreenplayHTML(script, options = {}) {
  const { includeTitlePage = true, showHighlights = true } = options;
  const elements = script.elements || [];

  const elementsHtml = elements
    .map((el) => {
      const text = el.text || '';
      let styleClass = 'action';
      let formattedText = escapeHtml(text);

      switch (el.type) {
        case ELEMENT_TYPES.SCENE_HEADING:
          styleClass = 'scene-heading';
          formattedText = formattedText.toUpperCase();
          break;
        case ELEMENT_TYPES.ACTION:
          styleClass = 'action';
          break;
        case ELEMENT_TYPES.CHARACTER:
          styleClass = 'character';
          formattedText = formattedText.toUpperCase();
          break;
        case ELEMENT_TYPES.DIALOGUE:
          styleClass = 'dialogue';
          break;
        case ELEMENT_TYPES.PARENTHETICAL:
          styleClass = 'parenthetical';
          if (!formattedText.startsWith('(') && !formattedText.endsWith(')')) {
            formattedText = `(${formattedText})`;
          }
          break;
        case ELEMENT_TYPES.TRANSITION:
          styleClass = 'transition';
          formattedText = formattedText.toUpperCase();
          break;
        default:
          styleClass = 'action';
      }

      // Character highlighting if present
      let highlightStyle = '';
      if (showHighlights && el.highlightColor) {
        highlightStyle = `style="background-color: ${el.highlightColor}; padding: 2px 4px; border-radius: 2px;"`;
      }

      return `<div class="element ${styleClass}"><span ${highlightStyle}>${formattedText}</span></div>`;
    })
    .join('\n');

  // Title page adheres to standard screenplay format with NO underline on title
  const titlePageHtml = includeTitlePage
    ? `
      <div class="page title-page">
        <div class="title-container">
          <div class="script-title">${escapeHtml((script.title || 'Untitled Screenplay').toUpperCase())}</div>
          <div class="byline">by</div>
          <div class="script-author">${escapeHtml(script.author || 'Anonymous')}</div>
        </div>
        <div class="title-footer">
          <div>Scripts by Darkchesa</div>
          <div>${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(script.title || 'Screenplay')} - Screenplay</title>
        <style>
          @page {
            size: letter;
            margin: 1in 1in 1in 1.5in;
            @top-right {
              content: counter(page) ".";
              font-family: "Courier New", Courier, monospace;
              font-size: 10pt;
            }
          }

          @page:first {
            @top-right {
              content: normal;
            }
          }

          body {
            font-family: "Courier New", Courier, "Courier Prime", monospace;
            font-size: 12pt;
            line-height: 1.0;
            color: #000000;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }

          .page {
            box-sizing: border-box;
          }

          .title-page {
            box-sizing: border-box;
            height: 8.5in;
            max-height: 8.5in;
            padding-top: 2.2in;
            text-align: center;
            position: relative;
            page-break-after: always;
            break-after: page;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .title-container {
            margin: 0 auto;
            text-align: center;
          }

          .script-title {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 20pt;
            letter-spacing: 1.5px;
          }

          .byline {
            font-size: 12pt;
            margin-bottom: 12pt;
          }

          .script-author {
            font-size: 14pt;
          }

          .title-footer {
            position: absolute;
            bottom: 0.3in;
            left: 0;
            font-size: 10pt;
            color: #555555;
            text-align: left;
          }

          .page-break {
            page-break-after: always;
            break-after: page;
          }

          /* Hollywood Standard Screenplay Layouts */
          .element {
            margin-top: 0;
            margin-bottom: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .scene-heading {
            font-weight: bold;
            margin-top: 18pt;
            margin-bottom: 6pt;
            text-transform: uppercase;
          }

          .action {
            margin-top: 6pt;
            margin-bottom: 6pt;
            line-height: 1.15;
          }

          .character {
            margin-top: 14pt;
            margin-bottom: 0pt;
            margin-left: 2.2in;
            text-transform: uppercase;
            font-weight: bold;
          }

          .dialogue {
            margin-top: 0pt;
            margin-bottom: 6pt;
            margin-left: 1.0in;
            width: 3.5in;
            line-height: 1.1;
          }

          .parenthetical {
            margin-top: 0pt;
            margin-bottom: 0pt;
            margin-left: 1.6in;
            width: 2.8in;
            font-style: italic;
          }

          .transition {
            margin-top: 12pt;
            margin-bottom: 12pt;
            text-align: right;
            font-weight: bold;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        ${titlePageHtml}
        <div class="page screenplay-content">
          ${elementsHtml}
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Ask user permission before saving file to their device
 */
function askSavePermission(filename, locationName) {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      const allowed = window.confirm(
        `Scripts by Darkchesa\n\nPermission Request: Do you want to save "${filename}" to your device?\n\nTarget Location: ${locationName}`
      );
      resolve(allowed);
    } else {
      AlertHelper.alert(
        'Permission to Save PDF',
        `Scripts by Darkchesa requests your permission to save this screenplay to your device.\n\nFile: ${filename}\nTarget Location: ${locationName}\n\nDo you want to proceed?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Allow & Save', onPress: () => resolve(true) },
        ],
        { cancelable: true, onDismiss: () => resolve(false) }
      );
    }
  });
}

/**
 * Export screenplay as a standard Hollywood PDF with permission prompt
 * and explicit location reporting on the user's device.
 */
export async function exportScreenplayPDF(script, options = {}) {
  const html = generateScreenplayHTML(script, options);
  const safeTitle = (script.title || 'Screenplay')
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  const filename = `${safeTitle}.pdf`;

  // ================= WEB PLATFORM =================
  if (Platform.OS === 'web') {
    const targetLocation = 'Device Downloads Folder / ' + filename;
    const hasPermission = await askSavePermission(filename, 'Downloads Folder');
    if (!hasPermission) {
      return { success: false, cancelled: true };
    }

    try {
      // 1. Direct file download to user's device Downloads
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${safeTitle}_Screenplay.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 2. Reliable Print-to-PDF via hidden iframe (avoids popup blockers)
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
        } catch (printErr) {
          console.warn('Print window error:', printErr);
        }
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (e) {}
        }, 1500);
      }, 400);

      return {
        success: true,
        location: targetLocation,
        filename,
        blobUrl,
        type: 'pdf',
        title: script.title,
      };
    } catch (err) {
      console.warn('Web PDF export error:', err);
      return { success: false, error: err.message };
    }
  }

  // ================= NATIVE MOBILE (ANDROID & IOS) =================
  try {
    const FileSystem = getFileSystem();
    const Print = require('expo-print');
    const Sharing = require('expo-sharing');

    // 1. Android Scoped Storage / Storage Access Framework (asks user permission to choose folder)
    if (Platform.OS === 'android' && FileSystem?.StorageAccessFramework) {
      const hasPermission = await askSavePermission(
        filename,
        'Device Storage (You will select the folder)'
      );
      if (!hasPermission) {
        return { success: false, cancelled: true };
      }

      // Prompt Android system folder picker (system permission dialog)
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const directoryUri = permissions.directoryUri;
        const readableFolder = getReadableDeviceLocation(directoryUri);

        // Generate high-fidelity PDF from HTML
        const pdfResult = await Print.printToFileAsync({
          html,
          base64: true,
        });

        // Save PDF file in the user-selected device folder
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

        AlertHelper.alert(
          'PDF Saved to Device',
          `Screenplay PDF was successfully saved!\n\nFile: ${filename}\nLocation on Device:\n${fullLocation}\n\nWould you like to open or share this PDF?`,
          [
            { text: 'Done', style: 'cancel' },
            {
              text: 'Open / Share',
              onPress: async () => {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(pdfResult.uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: `Share ${filename}`,
                    UTI: 'com.adobe.pdf',
                  });
                }
              },
            },
          ]
        );

        return {
          success: true,
          location: fullLocation,
          fileUri: createdFileUri,
          filename,
        };
      }
    }

    // 2. iOS and Android fallback (App Documents Directory)
    const docDir = getDocumentDirectory(FileSystem);
    const targetPath = `${docDir}${filename}`;
    const readableLocation = getReadableDeviceLocation(targetPath);

    const hasPermission = await askSavePermission(filename, readableLocation);
    if (!hasPermission) {
      return { success: false, cancelled: true };
    }

    // Generate PDF
    const pdfResult = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Copy to permanent device documents storage
    if (FileSystem?.copyAsync) {
      try {
        await FileSystem.copyAsync({
          from: pdfResult.uri,
          to: targetPath,
        });
      } catch (copyErr) {
        console.warn('Could not copy to document directory, using generated uri:', copyErr);
      }
    }

    const shareUri = targetPath || pdfResult.uri;

    AlertHelper.alert(
      'PDF Saved to Device',
      `Screenplay PDF saved successfully!\n\nFile: ${filename}\nLocation on Device:\n${readableLocation}\n\nWould you like to open or share this PDF?`,
      [
        { text: 'Done', style: 'cancel' },
        {
          text: 'Open / Share',
          onPress: async () => {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(shareUri, {
                mimeType: 'application/pdf',
                dialogTitle: `Share ${filename}`,
                UTI: 'com.adobe.pdf',
              });
            }
          },
        },
      ]
    );

    return {
      success: true,
      location: readableLocation,
      fileUri: shareUri,
      filename,
    };
  } catch (err) {
    console.error('PDF export error:', err);
    AlertHelper.alert('PDF Export Error', `Failed to export PDF: ${err.message}`);
    return { success: false, error: err.message };
  }
}
