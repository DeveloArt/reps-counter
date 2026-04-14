import { by, device, element, waitFor } from 'detox';

describe('App Screenshots (App Store / Google Play)', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' },
      url: 'fitcounter://e2e-seed',
    });
    await waitFor(element(by.id('tab-index'))).toBeVisible().withTimeout(15000);
  });

  it('should go through all tabs and take screenshots', async () => {
    // 1. Home Screen
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.takeScreenshot('01-HomeScreen');

    // 2. Stats Screen
    await element(by.id('tab-stats')).tap();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.takeScreenshot('02-StatsScreen');

    // 3. Goals Screen
    await element(by.id('tab-goals')).tap();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.takeScreenshot('03-GoalsScreen');

    // 4. Settings Screen
    await element(by.id('tab-settings')).tap();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.takeScreenshot('04-SettingsScreen');
  });
});

