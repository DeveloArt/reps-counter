import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function AddScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, []);

  return <View />;
}
