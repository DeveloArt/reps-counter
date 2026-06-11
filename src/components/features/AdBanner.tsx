import { ExternalLink, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdBannerProps {
  className?: string;
  adClient?: string;
  adSlot?: string;
}

export function AdBanner({ 
  className = "", 
  adClient = "ca-pub-XXXXXXXXXXXXXXXX", // Tutaj wpiszesz swój ID
  adSlot = "1234567890" // Tutaj wpiszesz ID jednostki
}: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAdSenseLoaded, setIsAdSenseLoaded] = useState(false);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsAdSenseLoaded(true);
    } catch (e) {
      console.error("AdSense error:", e);
      setIsAdSenseLoaded(false);
    }
  }, []);

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
        <ins className="adsbygoogle"
             style={{ display: 'block', textAlign: 'center' }}
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
