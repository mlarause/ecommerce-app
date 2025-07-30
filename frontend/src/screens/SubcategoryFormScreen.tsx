import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, useTheme, ActivityIndicator, Picker } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getSubcategory, createSubcategory, updateSubcategory } from '../api/subcategories';
import { getCategories } from '../api/categories';
import { Subcategory, Category } from '../api/subcategories';

type SubcategoryFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SubcategoryForm'>;

const SubcategorySchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
  category: Yup.string().required('Required'),
});

const SubcategoryFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<SubcategoryFormScreenNavigationProp>();
  const { colors } = useTheme();
  const [initialValues, setInitialValues] = useState<Subcategory>({
    name: '',
    description: '',
    category: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data);
        
        // Fetch subcategory if editing
        const { id, categoryId } = route.params as { id?: string; categoryId?: string };
        if (id) {
          const response = await getSubcategory(id);
          setInitialValues(response.data);
        } else if (categoryId) {
          setInitialValues(prev => ({
            ...prev,
            category: categoryId
          }));
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

  const handleSubmit = async (values: Subcategory) => {
    try {
      setLoading(true);
      if (values.id) {
        await updateSubcategory(values.id, values);
      } else {
        await createSubcategory(values);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save subcategory');
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
        validationSchema={SubcategorySchema}
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
            
            <Picker
              selectedValue={values.category}
              onValueChange={(itemValue) => setFieldValue('category', itemValue)}
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
            
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Save Subcategory
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

export default SubcategoryFormScreen;