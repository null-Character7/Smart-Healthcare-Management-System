import { atom } from 'recoil';

// Define an atom to store user role (doctor/patient)
export const role = atom({
  key: 'role', // unique ID
  default: '', // default value (empty string)
});
