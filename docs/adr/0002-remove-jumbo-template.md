# 0002 · Remove the Jumbo Admin Template

**Status:** accepted

## Context

The project started from _Jumbo React_ (Material UI v4), a commercial admin template. It included hundreds of files (`@jumbo`, `@coremat`, `@fake-db`), Firebase, maps, charts, rich text editors, and 60+ dependencies. The application only needed one form, one table, and a few chips.

## Decision

Remove the template and build the UI with custom components and CSS variables.

## Reasons

- **License:** a commercial template cannot be published in a public repository.
- **Security:** each dependency is attack surface; many were outdated (Material UI v4, React 16, axios 0.19).
- **Performance:** final bundle drops from multiple MB to a few dozen KB.
- **Clarity:** reviewers see the author’s code, not template code.

## Alternatives considered

- **Material UI v6 or shadcn/ui:** good options for a large app. For three screens, custom CSS is simpler and better demonstrates engineering judgment.

## Consequences

Fewer off-the-shelf components, but every UI line is custom, accessible (labels, roles, visible focus), and easy to maintain.
