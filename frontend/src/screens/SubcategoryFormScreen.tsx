import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../constants/app';
import { useNavigation, useRoute } from '@react-navigation/native';

const SubcategoryFormScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id?: string };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías
        const categoriesResponse = await axios.get(`${API_URL}/categories`);
        setCategories(categoriesResponse.data);

        // Si estamos editando, cargar los datos de la subcategoría
        if (id) {
          const response = await axios.get(`${API_URL}/subcategories/${id}`);
          setName(response.data.name);
          setDescription(response.data.description || '');
          setCategoryId(response.data.category.id);
        }
      } catch (error) {
        Alert.alert('Error', 'Error al cargar los datos');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = { name, description, category: categoryId };
      
      if (id) {
        await axios.put(`${API_URL}/subcategories/${id}`, data);
      } else {
        await axios.post(`${API_URL}/subcategories`, data);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Error al guardar la subcategoría');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <ActivityIndicator style={styles.loader} animating={true} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={!name || !categoryId}
        style={styles.button}
      >
        {id ? 'Actualizar' : 'Crear'} Subcategoría
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SubcategoryFormScreen;