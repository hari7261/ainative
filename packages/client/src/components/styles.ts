const AI_NATIVE_COMPONENT_STYLES = `
  :root {
    --ain-bg: #f5f7fb;
    --ain-surface: #ffffff;
    --ain-surface-muted: #f8fafc;
    --ain-surface-strong: #eef2f7;
    --ain-border: #d7deea;
    --ain-border-strong: #c6d0de;
    --ain-text: #162033;
    --ain-text-muted: #5d6b84;
    --ain-text-subtle: #7c889c;
    --ain-accent: #2457d6;
    --ain-accent-soft: #eaf0ff;
    --ain-success: #117a45;
    --ain-danger: #c43d3d;
    --ain-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  }

  .ain-shell,
  .ain-shell * {
    box-sizing: border-box;
  }

  .ain-shell {
    color: var(--ain-text);
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  }

  .ain-pane {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 18rem;
    min-height: 100%;
    border: 1px solid var(--ain-border);
    border-radius: 18px;
    background: var(--ain-surface);
    box-shadow: var(--ain-shadow);
    overflow: hidden;
  }

  .ain-pane-main {
    display: flex;
    min-height: 0;
    flex-direction: column;
    background: var(--ain-surface);
  }

  .ain-pane-side {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-left: 1px solid var(--ain-border);
    background: var(--ain-surface-muted);
  }

  .ain-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid var(--ain-border);
  }

  .ain-header-copy {
    min-width: 0;
  }

  .ain-kicker {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.55rem;
    border-radius: 999px;
    background: var(--ain-accent-soft);
    color: var(--ain-accent);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .ain-title {
    margin: 0.7rem 0 0.3rem;
    font-size: 1.35rem;
    line-height: 1.2;
  }

  .ain-subtitle {
    margin: 0;
    color: var(--ain-text-muted);
    line-height: 1.5;
  }

  .ain-status-row,
  .ain-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .ain-metric,
  .ain-status-pill,
  .ain-chip,
  .ain-mode-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-height: 2rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--ain-border);
    border-radius: 999px;
    background: var(--ain-surface);
    color: var(--ain-text-muted);
    font-size: 0.82rem;
    white-space: nowrap;
  }

  .ain-status-pill[data-state="active"],
  .ain-mode-toggle[data-active="true"] {
    border-color: #b9c7e9;
    background: var(--ain-accent-soft);
    color: var(--ain-accent);
  }

  .ain-mode-toggle {
    cursor: pointer;
  }

  .ain-mode-toggle:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ain-content {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #fcfdff;
  }

  .ain-error {
    padding: 0.85rem 1rem;
    border: 1px solid #f0c1c1;
    border-radius: 12px;
    background: #fff7f7;
    color: #8f2929;
  }

  .ain-empty {
    display: grid;
    gap: 1rem;
    padding: 1.25rem;
    border: 1px dashed var(--ain-border-strong);
    border-radius: 16px;
    background: var(--ain-surface);
  }

  .ain-empty-copy p,
  .ain-panel-copy p,
  .ain-event-item p {
    margin: 0;
    color: var(--ain-text-muted);
    line-height: 1.55;
  }

  .ain-empty-copy h3,
  .ain-panel-title {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .ai-stream-list {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    gap: 0.85rem;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  .ai-stream-message {
    max-width: min(85%, 42rem);
    padding: 0.95rem 1rem;
    border: 1px solid var(--ain-border);
    border-radius: 16px;
    background: var(--ain-surface);
  }

  .ai-stream-user {
    align-self: flex-end;
    border-color: #b9c7e9;
    background: #f1f5ff;
  }

  .ai-stream-assistant,
  .ai-stream-tool,
  .ai-stream-system {
    align-self: flex-start;
  }

  .ai-stream-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.45rem;
    color: var(--ain-text-subtle);
    font-size: 0.78rem;
  }

  .ai-stream-role {
    font-weight: 700;
    text-transform: capitalize;
  }

  .ai-stream-content {
    color: var(--ain-text);
    line-height: 1.65;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .ai-stream-metadata {
    margin-top: 0.7rem;
    color: var(--ain-text-muted);
  }

  .ai-stream-metadata pre {
    overflow-x: auto;
    padding: 0.75rem;
    border-radius: 12px;
    background: var(--ain-surface-muted);
    border: 1px solid var(--ain-border);
  }

  .ain-input-section {
    padding: 0 1.25rem 1.25rem;
  }

  .ai-input-container {
    border: 0;
    border-radius: 1.9rem;
    background: #1f2024;
    box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
  }

  .ai-input-attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0.9rem 0.9rem 0;
  }

  .ai-input-attachment {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    max-width: 100%;
    padding: 0.45rem 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(238, 243, 251, 0.8);
    font-size: 0.82rem;
  }

  .ai-input-attachment-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ai-input-preview {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .ai-input-main {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.05rem 1.15rem 0.95rem;
  }

  .ai-input-field {
    width: 100%;
    min-height: 4.5rem;
    padding: 0;
    border: 0;
    outline: 0;
    resize: none;
    background: transparent;
    color: #eff3fb;
    font: inherit;
    font-size: 1rem;
    line-height: 1.55;
  }

  .ai-input-field::placeholder {
    color: #8fa1c0;
  }

  .ai-input-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .ai-input-toolbar-left,
  .ai-input-toolbar-right,
  .ai-input-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ai-input-divider {
    width: 1px;
    height: 1.35rem;
    border-radius: 999px;
    background: rgba(147, 118, 255, 0.45);
  }

  .ai-input-btn,
  .ai-input-submit,
  .ain-secondary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.4rem;
    min-width: 2.4rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #a7b2c8;
    font: inherit;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }

  .ai-input-btn:hover,
  .ai-input-submit:hover,
  .ain-secondary-button:hover,
  .ain-mode-toggle:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #eff3fb;
  }

  .ai-input-btn svg,
  .ai-input-submit svg,
  .ain-mode-toggle svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  .ai-input-submit {
    min-height: 2.75rem;
    min-width: 2.75rem;
    background: #ffffff;
    color: #1f2024;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
  }

  .ai-input-submit:disabled,
  .ai-input-btn:disabled,
  .ain-secondary-button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .ain-secondary-button[data-variant="danger"] {
    color: var(--ain-danger);
  }

  .ain-secondary-button {
    min-width: auto;
    padding: 0.45rem 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(238, 243, 251, 0.85);
  }

  .ain-chip {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: #8fa1c0;
  }

  .ain-mode-toggle {
    min-height: 2.25rem;
    min-width: 2.25rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #a7b2c8;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
  }

  .ain-mode-toggle[data-active="true"] {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .ain-footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.95rem 1.25rem 1.1rem;
    border-top: 1px solid var(--ain-border);
    background: var(--ain-surface-muted);
    color: var(--ain-text-muted);
    font-size: 0.82rem;
  }

  .ain-side-panel {
    padding: 1rem;
    border: 1px solid var(--ain-border);
    border-radius: 16px;
    background: var(--ain-surface);
  }

  .ain-side-list,
  .ain-event-list {
    display: grid;
    gap: 0.65rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ain-side-list li,
  .ain-event-item {
    display: grid;
    gap: 0.2rem;
  }

  .ain-side-list strong,
  .ain-event-item strong {
    font-size: 0.84rem;
  }

  .ain-event-item time {
    color: var(--ain-text-subtle);
    font-size: 0.76rem;
  }

  .ain-voice-note {
    padding: 0.8rem 0.9rem;
    border: 1px solid #d7e8dc;
    border-radius: 12px;
    background: #f4fbf6;
    color: var(--ain-success);
    font-size: 0.9rem;
  }

  @media (max-width: 960px) {
    .ain-pane {
      grid-template-columns: minmax(0, 1fr);
    }

    .ain-pane-side {
      border-left: 0;
      border-top: 1px solid var(--ain-border);
    }
  }

  @media (max-width: 720px) {
    .ain-pane {
      border-radius: 0;
      border-left: 0;
      border-right: 0;
      min-height: 100vh;
    }

    .ain-header,
    .ain-content,
    .ain-input-section,
    .ain-footer,
    .ain-pane-side {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .ai-stream-message {
      max-width: 100%;
    }

    .ain-footer,
    .ain-header,
    .ai-input-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .ai-input-toolbar-left,
    .ai-input-toolbar-right {
      justify-content: space-between;
    }
  }
`;

let stylesApplied = false;

export function ensureAINativeComponentStyles(): void {
  if (stylesApplied || typeof document === 'undefined') {
    return;
  }

  if (document.getElementById('ainative-component-styles')) {
    stylesApplied = true;
    return;
  }

  const styleTag = document.createElement('style');
  styleTag.id = 'ainative-component-styles';
  styleTag.textContent = AI_NATIVE_COMPONENT_STYLES;
  document.head.appendChild(styleTag);
  stylesApplied = true;
}
