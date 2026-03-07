import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      <div className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-md p-4 border-b border-primary/10">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="size-6 text-primary" />
        </button>
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 ml-2">Terms of Use</h2>
      </div>
      <div className="p-6 text-foreground prose dark:prose-invert">
        <p><strong>Effective Date:</strong> March 7, 2026</p>
        
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using the FitCounter application, you agree to be bound by these Terms of Use.</p>

        <h3>2. Disclaimer of Liability</h3>
        <p>FitCounter is provided "as is" without any warranties. We are not responsible for any damages, health issues, or data loss resulting from the use of this application. Use it at your own risk.</p>

        <h3>3. Data Storage</h3>
        <p>All data is stored locally on your device. We do not transmit, store, or process your personal data on external servers.</p>

        <h3>4. Dispute Resolution</h3>
        <p>Any disputes arising from the use of this application shall be resolved exclusively by the competent courts in Gdańsk, Poland.</p>

        <h3>5. Changes to Terms</h3>
        <p>We reserve the right to modify these terms at any time. Continued use of the application constitutes acceptance of the new terms.</p>
      </div>
    </div>
  );
}
