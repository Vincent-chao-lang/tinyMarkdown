/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

console.log('[index.js] Starting tinyMarkdown app');
console.log('[index.js] App component:', App);
console.log('[index.js] App name:', appName);

AppRegistry.registerComponent(appName, () => {
  console.log('[index.js] Registering component:', appName);
  return App;
});

console.log('[index.js] Component registered successfully');
