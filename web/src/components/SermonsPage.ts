import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

const YOUTUBE_API_URL = "https://content-youtube.googleapis.com/youtube/v3/search?type=video&order=date&eventType=completed&channelId=UCtQ_XJELDHnjEolMjmIVpHw&maxResults=50&part=snippet&key=AIzaSyCGsp2PD5EuQgFkonuKQM-9ieCr2bhCY0M";

interface SermonItem {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      high: { url: string };
    };
  };
}

@customElement('sermons-page')
export class SermonsPage extends LitElement {
  @state()
  private sermons: SermonItem[] = [];

  @state()
  private loading = true;

  // Use light DOM to allow global styles (PicoCSS) to apply
  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchSermons();
  }

  private async fetchSermons() {
    try {
      const response = await fetch(YOUTUBE_API_URL);
      const data = await response.json();
      this.sermons = data.items || [];
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      this.loading = false;
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  }

  render() {
    if (this.loading) {
      return html`<div>Loading sermons...</div>`;
    }

    return html`
      <div class="sermons-list" style="display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
        ${this.sermons.map(item => html`
          <a
            href="https://www.youtube.com/watch?v=${item.id.videoId}"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: none; color: inherit; border: 1px solid #eee; border-radius: 8px; overflow: hidden; background: #fff;"
          >
            <img
              src="${item.snippet.thumbnails.high.url}"
              alt="${item.snippet.title}"
              style="width: 100%; height: auto; display: block;"
            />
            <div style="padding: 1rem;">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${item.snippet.title.replace(/&quot;/g, '"')}</h3>
              <p style="margin: 0; color: #666;">${this.formatDate(item.snippet.publishedAt)}</p>
            </div>
          </a>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sermons-page': SermonsPage;
  }
}
