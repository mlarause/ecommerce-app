import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, DataTable, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../constants/app';

// Define el tipo de producto
type Product = {
  _id: string;
  name: string;
  price: number;
};

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products.filter(prod => prod._id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} animating={true} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => console.log('Crear producto')}
        style={styles.addButton}
      >
        Nuevo Producto
      </Button>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Nombre</DataTable.Title>
          <DataTable.Title>Precio</DataTable.Title>
          <DataTable.Title>Acciones</DataTable.Title>
        </DataTable.Header>

        {products.map(product => (
          <DataTable.Row key={product._id}>
            <DataTable.Cell>{product.name}</DataTable.Cell>
            <DataTable.Cell>${product.price.toFixed(2)}</DataTable.Cell>
            <DataTable.Cell style={{ flexDirection: 'row' }}>
              <Button
                icon="pencil"
                onPress={() => console.log('Editar producto:', product._id)}
                compact
              >{''}</Button>
              <Button
                icon="delete"
                onPress={() => handleDelete(product._id)}
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

export default ProductsScreen;