import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
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
          {t('terms.title')}
        </h2>
      </div>
      <div className="p-6 text-foreground prose dark:prose-invert">
        <p>
          <strong>{t('terms.effectiveDate')}:</strong> March 7, 2026
        </p>

        <h3>{t('terms.section1.title')}</h3>
        <p>{t('terms.section1.content')}</p>

        <h3>{t('terms.section2.title')}</h3>
        <p>{t('terms.section2.content')}</p>

        <h3>{t('terms.section3.title')}</h3>
        <p>{t('terms.section3.content')}</p>

        <h3>{t('terms.section4.title')}</h3>
        <p>{t('terms.section4.content')}</p>

        <h3>{t('terms.section5.title')}</h3>
        <p>{t('terms.section5.content')}</p>
      </div>
    </div>
  );
}
