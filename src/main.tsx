import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// instala logger de fetch (erros >=400 e falhas de rede)
import './lib/networkDebug'

// Logs globais de erros para facilitar diagnóstico sem quebrar fluxo
if (typeof window !== 'undefined') {
		window.addEventListener('error', (e) => {
			console.error('[global:error]', (e as ErrorEvent).error || (e as ErrorEvent).message || e);
		});
		window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
			console.error('[global:unhandledrejection]', e.reason);
		});
}

createRoot(document.getElementById("root")!).render(<App />);
