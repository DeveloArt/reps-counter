import { privacyPolicyPL } from '@fitcounter/core';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      <div className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-md p-4 border-b border-primary/10">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="size-6 text-primary" />
        </button>
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
          Polityka Prywatności
        </h2>
      </div>
      <div className="p-6">
        <div className="prose dark:prose-invert prose-primary max-w-none">
          <ReactMarkdown>{privacyPolicyPL}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
