# Spotify Albums Web

Web client for [spotify-backend](../spotify-backend): search for an artist and view their albums ranked by popularity, along with your search history.

Version 2 of a 2022 project, rewritten with **React 19 + TypeScript + Redux Toolkit (RTK Query) + Context**. Decisions are in [`docs/adr`](docs/adr).

## State Distribution

| State Type                                 | Tool          | Example in this project            |
| ------------------------------------------ | ------------- | ---------------------------------- |
| **Server** state (remote data, cache)      | RTK Query     | Albums, history, current user      |
| **Global client** state                    | Redux slice   | Session (token and expiration)     |
| **UI preference** consumed across the tree | React Context | Light/dark theme                   |
| **Local** component state                  | `useState`    | Search input text, searched artist |

Choosing tools based on state type is the core project decision: see [ADR 0001](docs/adr/0001-state-distribution.md).

## Structure

```
src/
├── app/            # store, router, layout, typed hooks
├── shared/         # HTTP client (baseApi), config, error messages, ThemeContext
└── features/
    ├── auth/       # session slice, endpoints, login, register, protected route
    └── music/      # endpoints, search page, form, table, history
```

Each feature contains everything it needs (state, API, components, tests). Adding a new screen does not require touching other features.

## How to run

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5173 (requires spotify-backend running)
npm test           # Vitest + Testing Library
npm run build      # typecheck + production build
```

## What changed from version 1

| Before                                                                          | Now                                                       |
| ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Commercial template (Jumbo + Material UI v4) with 60+ dependencies, most unused | 4 runtime dependencies and custom CSS                     |
| Untyped JavaScript                                                              | Strict TypeScript across the entire codebase              |
| `axios.defaults.headers` mutated in every function (mutable global state)       | A single `baseApi` that adds token and logs out on 401    |
| Errors returned as data (`.catch(e => e)`)                                      | Explicit `isLoading`/`error` states and readable messages |
| `getAuthUser` always requested `jose123@gmail.com`                              | `GET /auth/me` returns user from token                    |
| User IP fetched from external service and sent to backend                       | Removed (privacy and performance)                         |
| Context used to pass results between sibling components                         | RTK Query for remote data; Context only for theme         |
| Token in `localStorage` without expiry                                          | `sessionStorage` with checked expiration date             |
| List keys based on array index                                                  | Stable, meaningful keys                                   |
| No tests                                                                        | Slice and component tests                                 |
