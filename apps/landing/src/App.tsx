import { Activity, ArrowRight, Dumbbell, ShieldCheck, Smartphone, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Dumbbell className="size-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">FitCounter</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://reps-counter-pwa.vercel.app/app"
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              Uruchom PWA
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
          Aplikacja stworzona z myślą o osobach, które chcą wprowadzić nawyki treningowe zgodnie z
          zasadami opisanymi w książkach takich jak <strong>"Atomic Habits"</strong> czy{' '}
          <strong>"Tiny Habits"</strong>. Prosta, szybka i w 100% prywatna.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="https://reps-counter-pwa.vercel.app/app"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
          >
            Przejdź do aplikacji
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

      {/* Features Section */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Wszystko, czego potrzebujesz</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Skup się na działaniu, nie na konfiguracji. FitCounter oferuje zestaw funkcji idealnie
              dopasowanych do budowania codziennych nawyków.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Szybkie Logowanie',
                desc: 'Dodaj serię pompek czy przysiadów w zaledwie 2 kliknięcia prosto z ekranu głównego.',
              },
              {
                icon: Target,
                title: 'Śledzenie Celów',
                desc: 'Ustaw dzienne lub tygodniowe cele i obserwuj swój postęp na czytelnych paskach.',
              },
              {
                icon: Activity,
                title: 'Statystyki i Historia',
                desc: 'Przeglądaj swoje osiągnięcia na wykresach i w kalendarzu, aby utrzymać motywację.',
              },
              {
                icon: ShieldCheck,
                title: 'Prywatność (Local-first)',
                desc: 'Twoje dane nigdy nie opuszczają Twojego urządzenia. Brak kont, haseł i chmury.',
              },
              {
                icon: Smartphone,
                title: 'Aplikacja PWA',
                desc: 'Zainstaluj aplikację bezpośrednio z przeglądarki na ekranie głównym swojego telefonu.',
              },
              {
                icon: Dumbbell,
                title: 'Własne Ćwiczenia',
                desc: 'Dodawaj własne ćwiczenia, przypisuj im kolory i ikony, aby spersonalizować swój trening.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
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
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Pobierz FitCounter</h2>
        <p className="text-lg text-muted-foreground mb-10">
          Aplikacja jest dostępna do pobrania w oficjalnych sklepach oraz jako wygodna aplikacja PWA
          (Progressive Web App).
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {/* Placeholder for Google Play */}
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
            <svg viewBox="0 0 24 24" className="size-6 fill-current">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider opacity-80">Pobierz z</div>
              <div className="text-sm font-bold">Google Play</div>
            </div>
          </button>

          {/* Placeholder for App Store */}
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-foreground text-background px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
            <svg viewBox="0 0 24 24" className="size-6 fill-current">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider opacity-80">Pobierz z</div>
              <div className="text-sm font-bold">App Store</div>
            </div>
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
          <h3 className="text-xl font-bold mb-4">Wersja PWA (Przeglądarkowa)</h3>
          <p className="text-muted-foreground mb-6">
            Nie chcesz instalować aplikacji ze sklepu? Użyj wersji PWA, która działa w każdej
            nowoczesnej przeglądarce i pozwala na dodanie skrótu do ekranu głównego.
          </p>
          <div className="mt-10 mb-8 flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex-1 bg-card border-2 border-primary/30 rounded-2xl p-6 shadow-md flex flex-col items-center">
              <div className="flex flex-col items-center mb-3">
                {/* Safari icon */}
                <svg className="size-9 mb-1" viewBox="0 0 256 256" fill="none">
                  <circle cx="128" cy="128" r="120" fill="#F4F4F4" />
                  <circle cx="128" cy="128" r="104" fill="#007AFF" />
                  <circle cx="128" cy="128" r="88" fill="#fff" />
                  <g>
                    <circle cx="128" cy="128" r="72" fill="#007AFF" />
                    <polygon points="128,56 136,128 128,200 120,128" fill="#fff" />
                    <polygon points="128,200 136,128 128,56 120,128" fill="#E94F35" />
                  </g>
                  <circle cx="128" cy="128" r="24" fill="#fff" />
                  <circle cx="128" cy="128" r="12" fill="#007AFF" />
                </svg>
                <h4 className="font-bold text-base text-primary text-center">Safari (iOS)</h4>
              </div>
              <ol className="list-decimal list-inside text-sm text-foreground/80 space-y-1 pl-2">
                <li>Otwórz aplikację w Safari.</li>
                <li>
                  Kliknij <b>Udostępnij</b> <span className="inline-block align-middle">🔗</span>.
                </li>
                <li>
                  Wybierz <b>Do ekranu początkowego</b>.
                </li>
                <li>
                  Potwierdź <b>Dodaj</b>.
                </li>
              </ol>
            </div>
            <div className="flex-1 bg-card border-2 border-primary/30 rounded-2xl p-6 shadow-md flex flex-col items-center">
              <div className="flex flex-col items-center mb-3">
                {/* Chrome icon */}
                <svg className="size-9 mb-1" viewBox="0 0 256 256" fill="none">
                  <circle cx="128" cy="128" r="120" fill="#F4F4F4" />
                  <g>
                    <path
                      d="M128 128L44 128C44 81.6 81.6 44 128 44C154.4 44 177.6 56.8 192 76.8L128 128Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M128 128L192 76.8C208 99.2 208 128 208 128C208 174.4 170.4 212 128 212C101.6 212 78.4 199.2 64 179.2L128 128Z"
                      fill="#34A853"
                    />
                    <path
                      d="M128 128L64 179.2C48 156.8 48 128 48 128C48 81.6 85.6 44 128 44C154.4 44 177.6 56.8 192 76.8L128 128Z"
                      fill="#FBBC05"
                    />
                  </g>
                  <circle cx="128" cy="128" r="44" fill="#fff" />
                  <circle cx="128" cy="128" r="28" fill="#4285F4" />
                </svg>
                <h4 className="font-bold text-base text-primary text-center">Chrome (Android)</h4>
              </div>
              <ol className="list-decimal list-inside text-sm text-foreground/80 space-y-1 pl-2">
                <li>Otwórz aplikację w Chrome.</li>
                <li>
                  Kliknij <b>menu</b>{' '}
                  <span className="inline-block align-middle align-text-bottom ml-1">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      className="inline"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="9" cy="3.5" r="1.5" fill="#0D5D5D" />
                      <circle cx="9" cy="9" r="1.5" fill="#0D5D5D" />
                      <circle cx="9" cy="14.5" r="1.5" fill="#0D5D5D" />
                    </svg>
                  </span>
                  .
                </li>
                <li>
                  Wybierz <b>Zainstaluj aplikację</b> lub <b>Dodaj do ekranu głównego</b>.
                </li>
                <li>Potwierdź instalację.</li>
              </ol>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 bg-muted p-4 rounded-xl font-mono text-sm mb-6 select-all">
            reps-counter-pwa.vercel.app/app
          </div>
          <a
            href="https://reps-counter-pwa.vercel.app/app"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            Uruchom teraz w przeglądarce
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} FitCounter. Zbudowane dla lepszych nawyków.</p>
      </footer>
    </div>
  );
}
