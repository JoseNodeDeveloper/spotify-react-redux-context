import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  authReducer,
  loggedOut,
  SESSION_STORAGE_KEY,
  sessionStarted,
} from "@/features/auth/authSlice";
import { baseApi } from "@/shared/api/baseApi";

/**
 * Side effects live outside reducers (reducers must stay pure):
 * persist the session and clear API cache on logout,
 * so the next user cannot see previous user data.
 */
const sessionListener = createListenerMiddleware();

sessionListener.startListening({
  actionCreator: sessionStarted,
  effect: (action) => {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(action.payload),
      );
    } catch {
      // Private browsing or blocked storage: session lasts only for this tab.
    }
  },
});

sessionListener.startListening({
  actionCreator: loggedOut,
  effect: (_action, api) => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // If storage is unavailable, there is nothing to clear.
    }
    api.dispatch(baseApi.util.resetApiState());
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/** Store factory: tests create a clean instance for each case. */
export function makeStore(preloadedState?: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) =>
      getDefault()
        .prepend(sessionListener.middleware)
        .concat(baseApi.middleware),
  });
  setupListeners(store.dispatch);
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
