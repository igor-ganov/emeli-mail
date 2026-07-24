import { describe, expect, it } from 'bun:test';
import { componentIdentity, rewriteTemplate } from './component-name.ts';

describe('componentIdentity', () => {
  it('derives every identifier from a single-word name', () => {
    const id = componentIdentity('avatar');
    expect(id).toEqual({
      kebab: 'avatar',
      pascal: 'Avatar',
      element: 'emeli-avatar',
      pkg: '@emeli/ui-avatar',
      repo: 'emeli-mail-ui-avatar',
      className: 'EmeliAvatar',
      cssPrefix: 'ea',
    });
  });

  it('handles multi-word kebab names', () => {
    const id = componentIdentity('message-row');
    expect(id.pascal).toBe('MessageRow');
    expect(id.element).toBe('emeli-message-row');
    expect(id.className).toBe('EmeliMessageRow');
    expect(id.cssPrefix).toBe('emr');
  });

  it('rejects non-kebab names', () => {
    expect(() => componentIdentity('MessageRow')).toThrow();
    expect(() => componentIdentity('message_row')).toThrow();
    expect(() => componentIdentity('-bad')).toThrow();
  });
});

describe('rewriteTemplate', () => {
  it('replaces every placeholder', () => {
    const id = componentIdentity('avatar');
    const out = rewriteTemplate(
      'name=__PKG__ tag=__ELEMENT__ class=__CLASS__ prefix=__PREFIX__ repo=__REPO__',
      id,
    );
    expect(out).toBe(
      'name=@emeli/ui-avatar tag=emeli-avatar class=EmeliAvatar prefix=ea repo=emeli-mail-ui-avatar',
    );
  });
});
