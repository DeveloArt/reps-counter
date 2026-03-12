export interface ButtonProps {
  href: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
