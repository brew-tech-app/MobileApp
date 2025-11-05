import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';
import Logger from './src/utils/logger';

export default function App(): React.JSX.Element {
  React.useEffect(() => {
    Logger.info('App mounted');
    return () => Logger.info('App unmounted');
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}
