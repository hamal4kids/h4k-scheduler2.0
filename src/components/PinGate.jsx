import { useState } from 'react';
import { APP_PIN } from '../config';

export default function PinGate({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === APP_PIN) {
      onUnlock();
    } else {
      setError(true);
      setPin('');
    }
  }

  return (
    <div className="min-h-screen bg-h4k-bg flex flex-col items-center justify-center p-6">
      <div className="h4k-card w-full max-w-sm text-center">
        <img src="/h4k-scheduler2.0/logo.png" alt="H4K" className="w-24 h-24 object-contain mx-auto mb-4" />
        <h1 className="font-fredoka text-3xl text-h4k-primary mb-1">H4K Scheduler</h1>
        <p className="font-varela text-sm text-gray-500 mb-8">חמ״ל לילדים — מערכת תזמון</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="קוד גישה"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            className="border-2 border-h4k-primary rounded-2xl px-4 py-3 text-center font-assistant text-lg outline-none focus:ring-2 focus:ring-h4k-highlight"
            autoFocus
          />
          {error && (
            <p className="text-red-500 font-assistant text-sm">קוד שגוי, נסי שוב</p>
          )}
          <button type="submit" className="btn-primary justify-center">
            <span>🔓</span> כניסה
          </button>
        </form>
      </div>
    </div>
  );
}
