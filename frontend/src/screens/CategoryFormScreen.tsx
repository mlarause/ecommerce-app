import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getCategory, createCategory, updateCategory } from '../api/categories';
import { Category } from '../api/categories';

type CategoryFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryForm'>;

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string(),
});

const CategoryFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<CategoryFormScreenNavigationProp>();
  const { colors } = useTheme();
  const [initialValues, setInitialValues] = useState<Category>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const { id } = route.params as { id?: string };
      if (id) {
        setLoading(true);
        try {
          const response = await getCategory(id);
          setInitialValues(response.data);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch category');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchCategory();
  }, [route.params]);

  const handleSubmit = async (values: Category) => {
    try {
      setLoading(true);
      if (values.id) {
        await updateCategory(values.id, values);
      } else {
        await createCategory(values);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  if (loading && initialValues.id) {
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
        validationSchema={CategorySchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
            
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Save Category
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

export default CategoryFormScreen;