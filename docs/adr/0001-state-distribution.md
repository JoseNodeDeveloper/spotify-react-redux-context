# 0001 · Split State by Type: RTK Query, Slice, Context, and useState

**Status:** accepted

## Context

Version 1 used Redux, Context, and `useState` at the same time, but without a clear criterion:

- Redux was used only for session and generic loading flags (`fetchStart`/`fetchSuccess`) that no screen displayed.
- A Context (`DataContext`) passed search results from the page to two direct child components. Props would have been enough.
- Requests were triggered manually in `useEffect`, with no cache, no error state, and no cancellation on unmount.

## Decision

1. **Server state → RTK Query.** Cache, deduplication, loading/error states, and tag invalidation (`SearchHistory`).
2. **Global client state → Redux slice.** Session only, needed by HTTP layer, protected routes, and header.
3. **UI preferences → Context.** Theme, consumed by many components and rarely changed. Value is memoized with `useMemo` to avoid unnecessary renders.
4. **Local state → `useState`.** Search input text and searched artist.

## Alternatives considered

- **TanStack Query + Zustand:** excellent and lighter combination. RTK Query was chosen because the repository needed to showcase Redux and keep server and client state in one store with DevTools.
- **Everything in Redux:** more boilerplate and manual cache handling.
- **Everything in Context:** every change re-renders all consumers; no cache or deduplication.

## Consequences

- The search page goes from 4 `useState` and 2 `useEffect` to 1 `useState` and 1 query hook.
- Repeating a recent search does not trigger a request (10-minute cache). Trade-off: in that case, the server does not update that search timestamp in history. Accepted.
