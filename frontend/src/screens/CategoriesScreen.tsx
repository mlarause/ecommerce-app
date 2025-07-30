import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, useTheme, DataTable, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getCategories, deleteCategory } from '../api/categories';
import { Category } from '../api/categories';

type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;

const CategoriesScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<CategoriesScreenNavigationProp>();
  const { colors } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (user?.role !== 'admin') {
        Alert.alert('Error', 'Only admin can delete categories');
        return;
      }
      
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete category');
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
          <Title style={styles.title}>Categories Management</Title>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('CategoryForm')}
            style={styles.addButton}
          >
            Add Category
          </Button>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            
            {categories.map(category => (
              <DataTable.Row key={category.id}>
                <DataTable.Cell>{category.name}</DataTable.Cell>
                <DataTable.Cell>{category.description || '-'}</DataTable.Cell>
                <DataTable.Cell>
                  <Button 
                    icon="pencil"
                    onPress={() => navigation.navigate('CategoryForm', { id: category.id })}
                    style={styles.actionButton}
                  />
                  {user?.role === 'admin' && (
                    <Button 
                      icon="delete"
                      onPress={() => handleDelete(category.id)}
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

export default CategoriesScreen;