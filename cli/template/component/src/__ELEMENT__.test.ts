import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import './__ELEMENT__.js';
import type { __CLASS__ } from './__ELEMENT__.js';

describe('__ELEMENT__', () => {
  it('renders a formatted label part', async () => {
    const el = await fixture<__CLASS__>(html`<__ELEMENT__ label="  hello  world "></__ELEMENT__>`);
    const label = el.shadowRoot?.querySelector('[part="label"]');
    expect(label?.textContent?.trim()).to.equal('hello world');
  });

  it('exposes a button role and is focusable', async () => {
    const el = await fixture<__CLASS__>(html`<__ELEMENT__ label="x"></__ELEMENT__>`);
    expect(el.getAttribute('role')).to.equal('button');
    expect(el.tabIndex).to.equal(0);
  });

  it('emits __ELEMENT__-activate on click', async () => {
    const el = await fixture<__CLASS__>(html`<__ELEMENT__ label="go"></__ELEMENT__>`);
    setTimeout(() => el.click());
    const ev = await oneEvent(el, '__ELEMENT__-activate');
    expect((ev.detail as { label: string }).label).to.equal('go');
  });
});
