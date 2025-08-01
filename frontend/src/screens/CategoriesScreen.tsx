import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, DataTable, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { API_URL } from '../constants/app';

// Define el tipo de categoría
type Category = {
  _id: string;
  name: string;
};


type RootStackParamList = {
  CategoryForm: { id?: string } | undefined;
  // ...otros screens
};

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la categoría');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} animating={true} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('CategoryForm')}
        style={styles.addButton}
      >
        Nueva Categoría
      </Button>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Nombre</DataTable.Title>
          <DataTable.Title>Acciones</DataTable.Title>
        </DataTable.Header>

        {categories.map(category => (
          <DataTable.Row key={category._id}>
            <DataTable.Cell>{category.name}</DataTable.Cell>
            <DataTable.Cell style={{ flexDirection: 'row' }}>
              <Button 
                icon="pencil"
                onPress={() => navigation.navigate('CategoryForm', { id: category._id })}
                compact
              >{''}</Button>
              <Button 
                icon="delete"
                onPress={() => handleDelete(category._id)}
                compact
                color="red"
              >{''}</Button>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoriesScreen;