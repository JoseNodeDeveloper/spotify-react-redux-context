import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { router } from '@/app/router';
import { makeStore } from '@/app/store';
import { ThemeProvider } from '@/shared/ui/ThemeContext';
import './styles.css';

const store = makeStore();
const container = document.getElementById('root');
if (!container) throw new Error('Element #root not found in index.html');

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
