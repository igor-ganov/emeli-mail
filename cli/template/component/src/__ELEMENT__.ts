import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { formatLabel } from './lib/format-label.js';

/**
 * `<__ELEMENT__>` — a headless Emeli component.
 *
 * Ships structure, behaviour and accessibility only; **no visual style**. Style
 * it from a theme pack via `::part(label)` and the `--__PREFIX__-*` custom
 * properties.
 *
 * @fires __ELEMENT__-activate {{ label: string }} the control was activated
 * @csspart label the activatable label
 */
@customElement('__ELEMENT__')
export class __CLASS__ extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }
    [part='label'] {
      cursor: pointer;
    }
  `;

  @property({ type: String })
  label = '';

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.addEventListener('click', this.activate);
    this.addEventListener('keydown', this.activate);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.activate);
    this.removeEventListener('keydown', this.activate);
    super.disconnectedCallback();
  }

  private activate = (event: MouseEvent | KeyboardEvent): void => {
    const isKey = 'key' in event;
    if (isKey && event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('__ELEMENT__-activate', {
        detail: { label: this.label },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render() {
    return html`<span part="label">${formatLabel(this.label)}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    '__ELEMENT__': __CLASS__;
  }
}
