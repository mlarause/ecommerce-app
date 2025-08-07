import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import UsersScreen from './src/screens/UsersScreen';
import SubcategoriesScreen from './src/screens/SubcategoriesScreen';
import CategoryFormScreen from './src/screens/CategoryFormScreen';
import ProductFormScreen from './src/screens/ProductFormScreen';
import UserFormScreen from './src/screens/UserFormScreen';
import SubcategoryFormScreen from './src/screens/SubcategoryFormScreen';

const Stack = createStackNavigator();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="CategoryForm" component={CategoryFormScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} />
            <Stack.Screen name="Users" component={UsersScreen} />
            <Stack.Screen name="UserForm" component={UserFormScreen} />
            <Stack.Screen name="Subcategories" component={SubcategoriesScreen} />
            <Stack.Screen name="SubcategoryForm" component={SubcategoryFormScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <SafeAreaProvider>
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  </SafeAreaProvider>
);

export default App;