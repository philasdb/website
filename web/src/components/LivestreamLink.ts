import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('livestream-link')
export class LivestreamLink extends LitElement {
  @property({ type: String })
  url = '';

  @state()
  private isLive = false;

  private intervalId?: number;

  // Disable Shadow DOM to allow global styles (PicoCSS) to apply
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkLiveStatus();
    this.intervalId = window.setInterval(() => this.checkLiveStatus(), 10000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async checkLiveStatus() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      this.isLive = data?.isLive || false;
    } catch (error) {
      this.isLive = false;
    }
  }

  render() {
    return html`
      <a href="/livestream">
        <span 
          id="live-stream-status-icon" 
          class="${this.isLive ? 'live-indicator red' : ''}"
        >
          ${this.isLive ? '🔴' : '⚪'}
        </span>
        ${this.isLive 
          ? html`<strong>LIVESTREAM</strong>` 
          : html`<span>LIVESTREAM</span>`
        }
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'livestream-link': LivestreamLink;
  }
}
