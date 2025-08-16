import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// instala logger de fetch (erros >=400 e falhas de rede)
import './lib/networkDebug'

createRoot(document.getElementById("root")!).render(<App />);
