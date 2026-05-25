import { ExternalLink, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  adClient?: string;
  adSlot?: string;
}

export function AdBanner({ 
  className = "", 
  adClient = "ca-pub-2472121183637363", 
  adSlot = "3946895151" 
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isVisible) return;

    let timeoutId: any;
    let attempts = 0;
    const maxAttempts = 15;

    const tryInitAd = () => {
      const insEl = insRef.current;
      if (!insEl) return;

      // Sprawdź czy reklama została już zainicjalizowana przez system AdSense
      if (insEl.getAttribute('data-adsbygoogle-status') === 'done' || pushedRef.current) {
        setIsAdSenseLoaded(true);
        return;
      }

      // Sprawdź czy element ma poprawną szerokość (zapobiega błędowi availableWidth=0)
      if (insEl.offsetWidth === 0) {
        attempts++;
        if (attempts < maxAttempts) {
          timeoutId = setTimeout(tryInitAd, 150);
        }
        return;
      }

      try {
        // Dodatkowa walidacja przed pushnięciem
        if (insEl.getAttribute('data-adsbygoogle-status') !== 'done' && !pushedRef.current) {
          pushedRef.current = true;
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsAdSenseLoaded(true);
        }
      } catch (e: any) {
        const errorMsg = e?.message || String(e);
        // Tłumimy błędy ponownego ładowania tego samego slotu
        if (!errorMsg.includes("already have ads")) {
          console.warn("Google AdSense init warning:", errorMsg);
        }
        setIsAdSenseLoaded(true); // Zapobiegamy pokazywaniu fallbecka jeśli skrypt działa ale ma ostrzeżenia
      }
    };

    // Opóźnienie startowe pozwalające na pełne ułożenie layoutu (layout pass)
    timeoutId = setTimeout(tryInitAd, 200);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [adSlot, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`px-4 py-2 w-full flex flex-col items-center ${className}`}>
      {/* Informacja o reklamie */}
      <div className="w-full flex justify-between items-center px-2 mb-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Reklama</span>
        <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
          <X className="size-3" />
        </button>
      </div>

      <div className="relative w-full bg-muted/20 border border-border/50 rounded-xl overflow-hidden min-h-[100px] flex items-center justify-center">
        {/* Prawdziwa jednostka AdSense */}
        <ins 
             ref={insRef}
             key={adSlot}
             className="adsbygoogle"
             style={{ display: 'block', textAlign: 'center', width: '100%', minWidth: '250px' }}
             data-ad-client={adClient}
             data-ad-slot={adSlot}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>

        {/* Fallback - widoczny jeśli AdSense nie zadziała lub nie ma klucza */}
        {!isAdSenseLoaded && (
          <div className="p-4 flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs uppercase">Adv</div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs font-bold truncate">Miejsce na Twoją Reklamę</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-1">Dotrzyj do aktywnych użytkowników.</p>
              </div>
            </div>
            <a href="mailto:kontakt@licznikpowtorzen.pl" className="bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0">
              Kontakt <ExternalLink className="size-2.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
