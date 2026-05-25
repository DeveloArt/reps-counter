import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Dumbbell, Activity, Target, Smartphone, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdBanner } from '@/components/features/AdBanner';

export default function LandingPage() {
  const APP_URL = "https://pwa.licznikpowtorzen.pl";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Dumbbell className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">LicznikPowtórzeń.pl</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={APP_URL}
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              Uruchom Aplikację
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
        >
          <Zap className="size-4" />
          <span>Zbuduj nawyk w 2 kliknięcia</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl"
        >
          Śledź swoje treningi. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            Bez wymówek.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl"
        >
          Aplikacja stworzona z myślą o osobach, które chcą wprowadzić nawyki treningowe zgodnie z zasadami opisanymi w książkach takich jak <strong>"Atomic Habits"</strong> czy <strong>"Tiny Habits"</strong>. Prosta, szybka i w 100% prywatna.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a 
            href={APP_URL}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
          >
            Uruchom teraz
            <ArrowRight className="size-5" />
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span>100% Prywatności (Local-first)</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-amber-500" />
            <span>Brak logowania</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="size-5 text-blue-500" />
            <span>Działa offline</span>
          </div>
        </motion.div>
      </section>

      {/* Ad Banner on Landing */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AdBanner />
      </div>

      {/* Features Section */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Wszystko, czego potrzebujesz</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Skup się na działaniu, nie na konfiguracji. Nasza aplikacja oferuje zestaw funkcji idealnie dopasowanych do budowania codziennych nawyków.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Szybkie Logowanie",
                desc: "Dodaj serię pompek czy przysiadów w zaledwie 2 kliknięcia prosto z ekranu głównego."
              },
              {
                icon: Target,
                title: "Śledzenie Celów",
                desc: "Ustaw dzienne lub tygodniowe cele i obserwuj swój postęp na czytelnych paskach."
              },
              {
                icon: Activity,
                title: "Statystyki i Historia",
                desc: "Przeglądaj swoje osiągnięcia na wykresach i w kalendarzu, aby utrzymać motywację."
              },
              {
                icon: ShieldCheck,
                title: "Prywatność (Local-first)",
                desc: "Twoje dane nigdy nie opuszczają Twojego urządzenia. Brak kont, haseł i chmury."
              },
              {
                icon: Smartphone,
                title: "Aplikacja PWA",
                desc: "Zainstaluj aplikację bezpośrednio z przeglądarki na ekranie głównym swojego telefonu."
              },
              {
                icon: Dumbbell,
                title: "Własne Ćwiczenia",
                desc: "Dodawaj własne ćwiczenia, przypisuj im kolory i ikony, aby spersonalizować swój trening."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Pobierz Aplikację</h2>
        <p className="text-lg text-muted-foreground mb-10">
          Aplikacja będzie wkrótce dostępna do pobrania w oficjalnych sklepach. Obecnie zapraszamy do korzystania z wersji PWA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {/* Placeholder for Google Play */}
          <div className="relative">
            <button disabled className="w-full sm:w-auto flex items-center justify-center gap-3 bg-foreground/50 text-background px-6 py-3 rounded-xl font-medium cursor-not-allowed">
              <svg viewBox="0 0 24 24" className="size-6 fill-current"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider opacity-60">Wkrótce w</div>
                <div className="text-sm font-bold opacity-80">Google Play</div>
              </div>
            </button>
            <span className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Już niedługo!</span>
          </div>

          {/* Placeholder for App Store */}
          <div className="relative">
            <button disabled className="w-full sm:w-auto flex items-center justify-center gap-3 bg-foreground/50 text-background px-6 py-3 rounded-xl font-medium cursor-not-allowed">
              <svg viewBox="0 0 24 24" className="size-6 fill-current"><path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" /></svg>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider opacity-60">Wkrótce w</div>
                <div className="text-sm font-bold opacity-80">App Store</div>
              </div>
            </button>
            <span className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Już niedługo!</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
          <h3 className="text-xl font-bold mb-4">Wersja PWA (Przeglądarkowa)</h3>
          <p className="text-muted-foreground mb-6">
            Zainstaluj aplikację bezpośrednio z przeglądarki na ekranie głównym swojego telefonu.
          </p>
          <div className="flex items-center justify-center gap-2 bg-muted p-4 rounded-xl font-mono text-sm mb-6 select-all">
            pwa.licznikpowtorzen.pl
          </div>
          <a 
            href={APP_URL}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            Uruchom teraz
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm">
        <p className="mb-4">© {new Date().getFullYear()} LicznikPowtórzeń.pl. Zbudowane dla lepszych nawyków.</p>
        <div className="flex justify-center gap-6 text-xs mb-4">
          <Link to="/app/terms" className="hover:text-foreground transition-colors font-semibold">Regulamin</Link>
          <Link to="/app/privacy" className="hover:text-foreground transition-colors font-semibold">Polityka Prywatności</Link>
        </div>
      </footer>
    </div>
  );
}
