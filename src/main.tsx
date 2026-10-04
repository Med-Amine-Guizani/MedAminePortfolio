import { createRoot } from 'react-dom/client';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource/caveat/latin-500.css';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/story.css';

createRoot(document.getElementById('root')!).render(<App />);
