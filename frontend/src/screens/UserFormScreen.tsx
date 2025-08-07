import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUser, createUser, updateUser } from '../api/users';
import { User } from '../api/users';

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coordinator";
}

const UserSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().test({
    name: 'password-required-when-new',
    test: function(value, context) {
      // Si no hay ID (usuario nuevo) y no hay contraseña, falla la validación
      if (!context.parent.id && !value) {
        return false;
      }
      return true;
    },
    message: 'Required'
  }),
  role: Yup.string().required('Required'),
});

const UserFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [initialValues, setInitialValues] = useState<Omit<User, 'id'> & { id?: string, password?: string }>({
    name: '',
    email: '',
    password: '',
    role: 'coordinator',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { id } = route.params as { id?: string };
      if (id) {
        setLoading(true);
        try {
          const response = await getUser(id);
          const userData = response.data as UserResponse;
          setInitialValues({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            password: '',
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch user');
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
  }, [route.params]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (values.id) {
        await updateUser(values.id, values);
      } else {
        await createUser(values);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save user');
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
        validationSchema={UserSchema}
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
              label="Email"
              mode="outlined"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email && !!errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            
            <TextInput
              label="Password"
              mode="outlined"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={touched.password && !!errors.password}
              secureTextEntry
              style={styles.input}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            
            <Picker
              selectedValue={values.role}
              onValueChange={handleChange('role')}
              style={styles.picker}
            >
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Coordinator" value="coordinator" />
            </Picker>
            
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Save User
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

export default UserFormScreen;