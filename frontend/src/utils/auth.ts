import * as SecureStore from 'expo-secure-store';

export const storeToken = async (token: string) => {
  await SecureStore.setItemAsync('auth_token', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('auth_token');
};