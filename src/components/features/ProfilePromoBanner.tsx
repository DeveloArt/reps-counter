import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export function ProfilePromoBanner() {
  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBU11pk97_1WpNCDCPxOVEv1xwgI8CAoId_v6LYddV5fELtrCn_3qlK_pcM6y4_mSa0HkaD2jLwxcYNHnhgiycCORkcoi1_tL3pN7QcdTQt724gtDh9gJoZSW9BU_-qglpASKXkrJoII_EWZWenW_OPnO2zhbq0qi6xg8Hhq53mnPO3myith-w4_A40WKCgYgILqZsAfgbOfBgiuWZWgR43Sj2CfhBWjMkxFQdhIAJSv4ROrUm61_eYzY1XfkJenqiq75XyDY606LTV";

  return (
    <motion.a
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      href="https://mateuszbukowski.pl"
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-muted border border-border p-5 shadow-sm group flex items-center justify-between gap-4 active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-4 z-10">
        <div className="relative size-16 shrink-0">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src={avatarUrl} 
            alt="Mateusz Bukowski" 
            className="size-full rounded-full object-cover border-2 border-primary/20 relative z-10 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary text-white size-6 rounded-full flex items-center justify-center border-2 border-background z-20 shadow-sm">
            <ExternalLink className="size-3" />
          </div>
        </div>
        
        <div className="min-w-0">
          <h4 className="text-base font-bold text-foreground leading-tight">Mateusz Bukowski</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Twórca tej aplikacji. Sprawdź moje pozostałe projekty i portfolio.
          </p>
        </div>
      </div>

      {/* Background decoration to match Daily Goal widget */}
      <div className="absolute -right-4 -bottom-4 size-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
    </motion.a>
  );
}
