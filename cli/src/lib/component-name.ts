/**
 * Derive the identifiers a scaffolded component needs from a single kebab-case
 * name, and rewrite template placeholders. Pure — the `new component` command
 * spawns/writes at the edge, this decides *what* to write.
 */

export type ComponentIdentity = {
  readonly kebab: string; // avatar-badge
  readonly pascal: string; // AvatarBadge
  readonly element: string; // emeli-avatar-badge
  readonly pkg: string; // @emeli/ui-avatar-badge
  readonly repo: string; // emeli-mail-ui-avatar-badge
  readonly className: string; // EmeliAvatarBadge
  readonly cssPrefix: string; // eab (initials)
};

const isKebab = (name: string): boolean => /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name);

const pascalCase = (kebab: string): string =>
  kebab
    .split('-')
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

const initials = (kebab: string): string =>
  `e${kebab
    .split('-')
    .map((part) => part.charAt(0))
    .join('')}`;

/**
 * @throws when `name` is not kebab-case (a-z, digits, single hyphens).
 */
export const componentIdentity = (name: string): ComponentIdentity => {
  switch (isKebab(name)) {
    case false:
      throw new Error(`component name must be kebab-case, got: "${name}"`);
    default: {
      const pascal = pascalCase(name);
      return {
        kebab: name,
        pascal,
        element: `emeli-${name}`,
        pkg: `@emeli/ui-${name}`,
        repo: `emeli-mail-ui-${name}`,
        className: `Emeli${pascal}`,
        cssPrefix: initials(name),
      };
    }
  }
};

/**
 * Replace template placeholders with values from a component identity.
 * Placeholders: __KEBAB__ __PASCAL__ __ELEMENT__ __PKG__ __REPO__ __CLASS__ __PREFIX__
 */
export const rewriteTemplate = (content: string, id: ComponentIdentity): string =>
  content
    .replaceAll('__KEBAB__', id.kebab)
    .replaceAll('__PASCAL__', id.pascal)
    .replaceAll('__ELEMENT__', id.element)
    .replaceAll('__PKG__', id.pkg)
    .replaceAll('__REPO__', id.repo)
    .replaceAll('__CLASS__', id.className)
    .replaceAll('__PREFIX__', id.cssPrefix);
