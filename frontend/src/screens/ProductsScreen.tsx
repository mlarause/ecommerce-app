import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, useTheme, DataTable, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getProducts, deleteProduct } from '../api/products';
import { Product } from '../api/products';

type ProductsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Products'>;

const ProductsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const { colors } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (user?.role !== 'admin') {
        Alert.alert('Error', 'Only admin can delete products');
        return;
      }
      
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Products Management</Title>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('ProductForm')}
            style={styles.addButton}
          >
            Add Product
          </Button>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Price</DataTable.Title>
              <DataTable.Title>Category</DataTable.Title>
              <DataTable.Title>Subcategory</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            
            {products.map(product => (
              <DataTable.Row key={product.id}>
                <DataTable.Cell>{product.name}</DataTable.Cell>
                <DataTable.Cell>{product.description || '-'}</DataTable.Cell>
                <DataTable.Cell>${product.price.toFixed(2)}</DataTable.Cell>
                <DataTable.Cell>{product.category.name}</DataTable.Cell>
                <DataTable.Cell>{product.subcategory.name}</DataTable.Cell>
                <DataTable.Cell>
                  <Button 
                    icon="pencil"
                    onPress={() => navigation.navigate('ProductForm', { id: product.id })}
                    style={styles.actionButton}
                  />
                  {user?.role === 'admin' && (
                    <Button 
                      icon="delete"
                      onPress={() => handleDelete(product.id)}
                      style={styles.actionButton}
                    />
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 5,
  },
  title: {
    marginBottom: 15,
  },
  addButton: {
    marginBottom: 15,
  },
  actionButton: {
    marginHorizontal: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;