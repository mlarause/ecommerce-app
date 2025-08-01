import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, DataTable, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../constants/app';

const SubcategoriesScreen = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId } = route.params || {};

  const fetchSubcategories = async () => {
    try {
      const url = categoryId 
        ? `${API_URL}/subcategories/category/${categoryId}`
        : `${API_URL}/subcategories`;
      const response = await axios.get(url);
      setSubcategories(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las subcategorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/subcategories/${id}`);
      setSubcategories(subcategories.filter(sub => sub.id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la subcategoría');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} animating={true} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('SubcategoryForm', { categoryId })}
        style={styles.addButton}
      >
        Nueva Subcategoría
      </Button>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Nombre</DataTable.Title>
          <DataTable.Title>Categoría</DataTable.Title>
          <DataTable.Title>Acciones</DataTable.Title>
        </DataTable.Header>

        {subcategories.map(subcategory => (
          <DataTable.Row key={subcategory.id}>
            <DataTable.Cell>{subcategory.name}</DataTable.Cell>
            <DataTable.Cell>{subcategory.category?.name || '-'}</DataTable.Cell>
            <DataTable.Cell>
              <Button
                icon="pencil"
                onPress={() => navigation.navigate('SubcategoryForm', { 
                  id: subcategory.id,
                  categoryId: subcategory.category?.id
                })}
              />
              <Button
                icon="delete"
                onPress={() => handleDelete(subcategory.id)}
              />
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

export default SubcategoriesScreen;