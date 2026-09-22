interface AdBannerProps {
  className?: string;
  adClient?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  maxHeight?: number;
}

export function AdBanner({ 
  className = "", 
  adClient = "ca-pub-2472121183637363", 
  adSlot = "3946895151",
  adFormat = "horizontal",
  maxHeight = 100
}: AdBannerProps) {
  // Wyłączone na ten moment na życzenie użytkownika
  void className;
  void adClient;
  void adSlot;
  void adFormat;
  void maxHeight;
  return null;
}
