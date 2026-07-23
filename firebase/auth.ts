import { getAuth, type Auth } from 'firebase/auth';
import { getFirebaseApp } from './config';

let _auth: Auth | null = null;

function getAuthInstance(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    return Reflect.get(getAuthInstance() as unknown as Record<string | symbol, unknown>, prop);
  },
});
