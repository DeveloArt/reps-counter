import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}
