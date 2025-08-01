import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../constants/app';
import { useNavigation, useRoute } from '@react-navigation/native';

const ProductFormScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id?: string };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      const fetchSubcategories = async () => {
        const response = await axios.get(`${API_URL}/subcategories/category/${categoryId}`);
        setSubcategories(response.data);
      };
      fetchSubcategories();
    }
  }, [categoryId]);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${API_URL}/products/${id}`);
          setName(response.data.name);
          setDescription(response.data.description || '');
          setPrice(response.data.price.toString());
          setCategoryId(response.data.category.id);
          setSubcategoryId(response.data.subcategory.id);
          
          // Cargar subcategorías para la categoría seleccionada
          const subcatsResponse = await axios.get(`${API_URL}/subcategories/category/${response.data.category.id}`);
          setSubcategories(subcatsResponse.data);
        } catch (error) {
          Alert.alert('Error', 'Error al cargar el producto');
        } finally {
          setLoadingData(false);
        }
      };
      fetchProduct();
    } else {
      setLoadingData(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        name,
        description,
        price: parseFloat(price),
        category: categoryId,
        subcategory: subcategoryId
      };
      
      if (id) {
        await axios.put(`${API_URL}/products/${id}`, data);
      } else {
        await axios.post(`${API_URL}/products`, data);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Error al guardar el producto');
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
        label="Nombre del producto"
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
      
      <TextInput
        label="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={!name || !price || !categoryId || !subcategoryId}
        style={styles.button}
      >
        {id ? 'Actualizar' : 'Crear'} Producto
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

export default ProductFormScreen;