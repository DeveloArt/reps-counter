import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-[100] max-w-[440px] mx-auto"
        >
          <div className="bg-card border border-border shadow-2xl rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-xl shrink-0 h-fit">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight mb-1">Dbamy o Twoją prywatność</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Używamy lokalnej pamięci, aby aplikacja działała poprawnie. Jeśli włączymy reklamy zewnętrzne, zapytamy Cię o dodatkową zgodę. 
                  Szczegóły znajdziesz w <Link to="/app/privacy" className="text-primary hover:underline">Polityce Prywatności</Link>.
                </p>
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-primary text-white py-2 px-4 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                Rozumiem i akceptuję
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
