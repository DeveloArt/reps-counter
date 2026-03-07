import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
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
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 ml-2">Privacy Policy</h2>
      </div>
      <div className="p-6 text-foreground prose dark:prose-invert">
        <p><strong>Effective Date:</strong> March 7, 2026</p>

        <h3>1. Data Collection</h3>
        <p>FitCounter does not collect, transmit, or share any personal information. The application operates entirely offline.</p>

        <h3>2. Local Storage</h3>
        <p>All workout logs, goals, and settings are stored locally in your device's memory (IndexedDB/LocalStorage). You have full control over your data.</p>

        <h3>3. No Third-Party Sharing</h3>
        <p>Since we do not collect data, we do not share any data with third parties, advertisers, or analytics providers.</p>

        <h3>4. Data Security</h3>
        <p>Your data remains on your device. We recommend securing your device with a passcode or biometrics to protect your information.</p>

        <h3>5. Contact</h3>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  );
}
