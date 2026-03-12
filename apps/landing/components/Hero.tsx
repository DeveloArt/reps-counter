import { Button } from './Button';

export function Hero() {
  return (
    <header className="text-center mb-16">
      <h1 className="text-5xl font-bold text-teal-700 mb-4">FitCounter</h1>
      <p className="text-xl text-gray-600 mb-8">Track your micro-workouts throughout the day</p>
      <div className="flex gap-4 justify-center">
        <Button href="/app" variant="primary">
          Get Started
        </Button>
        <Button href="#features" variant="secondary">
          Learn More
        </Button>
      </div>
    </header>
  );
}
