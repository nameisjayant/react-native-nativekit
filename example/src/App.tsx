import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import HomeScreen, { type DemoRoute } from './screens/HomeScreen';
import ButtonDemo from './screens/ButtonDemo';
import BottomSheetDemo from './screens/BottomSheetDemo';
import NativeViewDemo from './screens/NativeViewDemo';

export default function App() {
  const [route, setRoute] = useState<DemoRoute | null>(null);
  const goHome = () => setRoute(null);

  // Android hardware back returns to the home screen instead of exiting.
  useEffect(() => {
    if (!route) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setRoute(null);
      return true;
    });
    return () => sub.remove();
  }, [route]);

  switch (route) {
    case 'button':
      return <ButtonDemo onBack={goHome} />;
    case 'bottomSheet':
      return <BottomSheetDemo onBack={goHome} />;
    case 'nativeView':
      return <NativeViewDemo onBack={goHome} />;
    default:
      return <HomeScreen onOpen={setRoute} />;
  }
}
