import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, useTheme, ActivityIndicator, Picker } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getProduct, createProduct, updateProduct } from '../api/products';
import { getCategories, getSubcategoriesByCategory } from '../api/categories';
import { Product, Category, Subcategory } from '../api/products';

type ProductFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductForm'>;

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  price: Yup.number().required('Required').min(0, 'Price must be positive'),
  category: Yup.string().required('Required'),
  subcategory: Yup.string().required('Required'),
});

const ProductFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<ProductFormScreenNavigationProp>();
  const { colors } = useTheme();
  const [initialValues, setInitialValues] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data);
        
        // Fetch product if editing
        const { id } = route.params as { id?: string };
        if (id) {
          const response = await getProduct(id);
          setInitialValues(response.data);
          
          // Fetch subcategories for the product's category
          const subcategoriesResponse = await getSubcategoriesByCategory(response.data.category.id);
          setSubcategories(subcategoriesResponse.data);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch data');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [route.params]);

  const handleCategoryChange = async (categoryId: string, setFieldValue: any) => {
    try {
      setLoading(true);
      setFieldValue('category', categoryId);
      setFieldValue('subcategory', '');
      
      const response = await getSubcategoriesByCategory(categoryId);
      setSubcategories(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Product) => {
    try {
      setLoading(true);
      if (values.id) {
        await updateProduct(values.id, values);
      } else {
        await createProduct(values);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && (!initialValues.id || !categories.length)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            <TextInput
              label="Name"
              mode="outlined"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              error={touched.name && !!errors.name}
              style={styles.input}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}
            
            <TextInput
              label="Description"
              mode="outlined"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description || ''}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            
            <TextInput
              label="Price"
              mode="outlined"
              onChangeText={handleChange('price')}
              onBlur={handleBlur('price')}
              value={values.price.toString()}
              error={touched.price && !!errors.price}
              keyboardType="numeric"
              style={styles.input}
            />
            {touched.price && errors.price && (
              <Text style={styles.error}>{errors.price}</Text>
            )}
            
            <Picker
              selectedValue={values.category}
              onValueChange={(itemValue) => handleCategoryChange(itemValue, setFieldValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map(category => (
                <Picker.Item 
                  key={category.id} 
                  label={category.name} 
                  value={category.id} 
                />
              ))}
            </Picker>
            {touched.category && errors.category && (
              <Text style={styles.error}>{errors.category}</Text>
            )}
            
            <Picker
              selectedValue={values.subcategory}
              onValueChange={(itemValue) => setFieldValue('subcategory', itemValue)}
              style={styles.picker}
              enabled={!!values.category}
            >
              <Picker.Item label="Select a subcategory" value="" />
              {subcategories.map(subcategory => (
                <Picker.Item 
                  key={subcategory.id} 
                  label={subcategory.name} 
                  value={subcategory.id} 
                />
              ))}
            </Picker>
            {touched.subcategory && errors.subcategory && (
              <Text style={styles.error}>{errors.subcategory}</Text>
            )}
            
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Save Product
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 10,
  },
  picker: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductFormScreen;