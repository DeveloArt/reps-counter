import { privacyPolicyPL, termsOfServicePL } from '@fitcounter/core';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const content = type === 'privacy' ? privacyPolicyPL : termsOfServicePL;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 pb-20">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <a
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Wróć do strony głównej</span>
          </a>
        </div>
      </nav>

      <div className="pt-28 px-4 max-w-3xl mx-auto">
        <div className="prose dark:prose-invert prose-primary max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
