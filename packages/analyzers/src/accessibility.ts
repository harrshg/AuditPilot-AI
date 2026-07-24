import { AccessibilitySignal, AnalyzerIssue } from './types.js';

export function analyzeAccessibility(signals: AccessibilitySignal[]): AnalyzerIssue[] {
  const issues: AnalyzerIssue[] = [];

  for (const signal of signals) {
    if (signal.totalImages > 0 && signal.imagesWithoutAlt > 0) {
      const ratio = signal.imagesWithoutAlt / signal.totalImages;
      issues.push({
        title: 'Images missing alt text',
        description: `${signal.imagesWithoutAlt} of ${signal.totalImages} images on this page are missing alt attributes.`,
        category: 'ACCESSIBILITY',
        severity: ratio >= 0.5 ? 'HIGH' : ratio >= 0.2 ? 'MEDIUM' : 'LOW',
        affectedUrl: signal.url,
        evidence: { imagesWithoutAlt: signal.imagesWithoutAlt, totalImages: signal.totalImages },
        recommendationText: 'Add descriptive alt attributes to all meaningful images, and empty alt="" to decorative images.',
      });
    }

    if (signal.totalInputs > 0 && signal.inputsWithoutLabel > 0) {
      const ratio = signal.inputsWithoutLabel / signal.totalInputs;
      issues.push({
        title: 'Form inputs missing labels',
        description: `${signal.inputsWithoutLabel} of ${signal.totalInputs} form inputs on this page are not associated with a label.`,
        category: 'ACCESSIBILITY',
        severity: ratio >= 0.5 ? 'HIGH' : 'MEDIUM',
        affectedUrl: signal.url,
        evidence: { inputsWithoutLabel: signal.inputsWithoutLabel, totalInputs: signal.totalInputs },
        recommendationText: 'Associate every form input with a visible <label> or an aria-label attribute.',
      });
    }

    if (signal.lowContrastElements && signal.lowContrastElements > 0) {
      issues.push({
        title: 'Low contrast text detected',
        description: `${signal.lowContrastElements} element(s) on this page appear to have insufficient color contrast.`,
        category: 'ACCESSIBILITY',
        severity: 'MEDIUM',
        affectedUrl: signal.url,
        evidence: { lowContrastElements: signal.lowContrastElements },
        recommendationText: 'Increase text/background color contrast to meet WCAG AA (4.5:1) guidelines.',
      });
    }

    if (signal.missingLangAttribute) {
      issues.push({
        title: 'Missing document language attribute',
        description: 'The <html> element is missing a lang attribute, which affects screen reader pronunciation.',
        category: 'ACCESSIBILITY',
        severity: 'LOW',
        affectedUrl: signal.url,
        recommendationText: 'Add a lang attribute (e.g. lang="en") to the <html> element.',
      });
    }

    if (signal.missingDocumentTitle) {
      issues.push({
        title: 'Missing document title',
        description: 'The page is missing a <title> element, which affects screen readers and browser tabs.',
        category: 'ACCESSIBILITY',
        severity: 'LOW',
        affectedUrl: signal.url,
        recommendationText: 'Add a descriptive, unique <title> element to the page.',
      });
    }
  }

  return issues;
}
