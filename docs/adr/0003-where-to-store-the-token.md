# 0003 · Where to Store the Access Token

**Status:** accepted (revisit if the app grows)

## Context

Version 1 stored JWT in `localStorage` without expiration date and copied it into `axios.defaults`, a global object any module could mutate.

## Options

| Option                            | Advantage                         | Risk                                                           |
| --------------------------------- | --------------------------------- | -------------------------------------------------------------- |
| `localStorage`                    | Survives browser close            | Accessible to injected scripts (XSS) and persists indefinitely |
| `sessionStorage`                  | Cleared when tab closes           | Still accessible to XSS                                        |
| In memory only                    | Not readable from browser storage | Lost on page reload                                            |
| `httpOnly` cookie + refresh token | JavaScript cannot read it         | Requires backend changes and CSRF protection                   |

## Decision

`sessionStorage` + Redux, also storing expiration timestamp. Session is discarded at startup if expired and automatically closed on any 401.

Because the main risk is XSS, mitigation starts at source: React escapes content by default, `dangerouslySetInnerHTML` is not used, `index.html` has a CSP, and token lifetime is only 15 minutes.

## Consequences

For production, the recommended next step is moving session to an `httpOnly` cookie with rotating refresh token, coordinated with the backend (see spotify-backend ADR 0004).
