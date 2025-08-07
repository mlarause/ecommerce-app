import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';
import UserFormScreen from '../screens/UserFormScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryFormScreen from '../screens/CategoryFormScreen';
import SubcategoriesScreen from '../screens/SubcategoriesScreen';
import SubcategoryFormScreen from '../screens/SubcategoryFormScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';

const Stack = createStackNavigator();

export const MainStack = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // O un spinner de carga
  }

  return (
    <Stack.Navigator>
      {user ? (
        // Usuario autenticado - mostrar pantallas principales
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
          <Stack.Screen name="Users" component={UsersScreen} options={{ title: 'Users' }} />
          <Stack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'User Form' }} />
          <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
          <Stack.Screen name="CategoryForm" component={CategoryFormScreen} options={{ title: 'Category Form' }} />
          <Stack.Screen name="Subcategories" component={SubcategoriesScreen} options={{ title: 'Subcategories' }} />
          <Stack.Screen name="SubcategoryForm" component={SubcategoryFormScreen} options={{ title: 'Subcategory Form' }} />
          <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Products' }} />
          <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Product Form' }} />
          {/* Otras pantallas del dashboard */}
        </>
      ) : (
        // Usuario no autenticado - mostrar login
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};