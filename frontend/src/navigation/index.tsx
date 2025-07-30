import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Users: undefined;
  UserForm: { id?: string };
  Categories: undefined;
  CategoryForm: { id?: string };
  Subcategories: { categoryId?: string };
  SubcategoryForm: { id?: string; categoryId?: string };
  Products: undefined;
  ProductForm: { id?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Users" component={UsersScreen} options={{ title: 'Users' }} />
      <Stack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'User Form' }} />
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="CategoryForm" component={CategoryFormScreen} options={{ title: 'Category Form' }} />
      <Stack.Screen name="Subcategories" component={SubcategoriesScreen} options={{ title: 'Subcategories' }} />
      <Stack.Screen name="SubcategoryForm" component={SubcategoryFormScreen} options={{ title: 'Subcategory Form' }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Product Form' }} />
    </Stack.Navigator>
  );
};