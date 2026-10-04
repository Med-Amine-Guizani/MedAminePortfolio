import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/sections.css';

createRoot(document.getElementById('root')!).render(<App />);

// For the engineers who open DevTools.
console.log(
  `%c
   ┌─────────────────────────────────────────────┐
   │   agent://amine-guizani                     │
   │   status: shipping · env: production        │
   └─────────────────────────────────────────────┘
%c  You opened the console. We should probably talk.
  → amineguizani33@gmail.com
`,
  'color:#ff6a2b;font-family:monospace',
  'color:#f2ede6;font-family:monospace;font-size:12px',
);
