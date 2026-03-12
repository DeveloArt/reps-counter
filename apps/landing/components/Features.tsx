import type { Feature } from '@/types';

export function Features() {
  const features: Feature[] = [
    {
      icon: '💪',
      title: 'Track Exercises',
      description: 'Log pushups, squats, planks and more with just a few taps',
    },
    {
      icon: '🎯',
      title: 'Set Goals',
      description: 'Create daily, weekly or monthly goals to stay motivated',
    },
    {
      icon: '📊',
      title: 'View Stats',
      description: 'Track your progress with beautiful charts and statistics',
    },
  ];

  return (
    <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
      {features.map((feature, index) => (
        <div key={index} className="text-center p-6">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
