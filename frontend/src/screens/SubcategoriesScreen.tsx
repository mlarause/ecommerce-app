import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, useTheme, DataTable, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getSubcategories, getSubcategoriesByCategory, deleteSubcategory } from '../api/subcategories';
import { Subcategory } from '../api/subcategories';

type SubcategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Subcategories'>;

const SubcategoriesScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<SubcategoriesScreenNavigationProp>();
  const route = useRoute();
  const { colors } = useTheme();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = route.params as { categoryId?: string };

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        let response;
        if (categoryId) {
          response = await getSubcategoriesByCategory(categoryId);
        } else {
          response = await getSubcategories();
        }
        setSubcategories(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch subcategories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubcategories();
  }, [categoryId]);

  const handleDelete = async (id: string) => {
    try {
      if (user?.role !== 'admin') {
        Alert.alert('Error', 'Only admin can delete subcategories');
        return;
      }
      
      await deleteSubcategory(id);
      setSubcategories(subcategories.filter(subcategory => subcategory.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete subcategory');
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
          <Title style={styles.title}>
            {categoryId ? 'Subcategories by Category' : 'All Subcategories'}
          </Title>
          
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('SubcategoryForm', { categoryId })}
            style={styles.addButton}
          >
            Add Subcategory
          </Button>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Category</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            
            {subcategories.map(subcategory => (
              <DataTable.Row key={subcategory.id}>
                <DataTable.Cell>{subcategory.name}</DataTable.Cell>
                <DataTable.Cell>{subcategory.description || '-'}</DataTable.Cell>
                <DataTable.Cell>{subcategory.category.name}</DataTable.Cell>
                <DataTable.Cell>
                  <Button 
                    icon="pencil"
                    onPress={() => navigation.navigate('SubcategoryForm', { 
                      id: subcategory.id,
                      categoryId: subcategory.category.id
                    })}
                    style={styles.actionButton}
                  />
                  {user?.role === 'admin' && (
                    <Button 
                      icon="delete"
                      onPress={() => handleDelete(subcategory.id)}
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

export default SubcategoriesScreen;