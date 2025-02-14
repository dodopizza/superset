import { FirebaseService } from '.';
import { firebaseConfig } from './constants';

const setupFirebase = () => {
  if (firebaseConfig) FirebaseService.init(firebaseConfig);
};

export default setupFirebase;
