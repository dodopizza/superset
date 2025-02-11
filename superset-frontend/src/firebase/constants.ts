const PROD_CONFIIG = {
  apiKey: 'AIzaSyDQrzGxBseb-tjYNxQbcYK2U4s1GzdWq-Q',
  authDomain: 'superset-prod-bcac8.firebaseapp.com',
  projectId: 'superset-prod-bcac8',
  storageBucket: 'superset-prod-bcac8.firebasestorage.app',
  messagingSenderId: '940775662277',
  appId: '1:940775662277:web:ebcc5428a3b4918f8b46ac',
  measurementId: 'G-VRTSQP6NTT',
};

const DEV_CONFIG = {
  apiKey: 'AIzaSyCb3ug-gT-7ArBr7VogXbJLz9qovXjL4Ic',
  authDomain: 'superset-dodo.firebaseapp.com',
  projectId: 'superset-dodo',
  storageBucket: 'superset-dodo.firebasestorage.app',
  messagingSenderId: '430305624426',
  appId: '1:430305624426:web:34d7465fbd7eb5bfade513',
  measurementId: 'G-CFEM8XE8MC',
};

export const firebaseConfig =
  process.env.NODE_ENV === 'development' ? DEV_CONFIG : PROD_CONFIIG;
