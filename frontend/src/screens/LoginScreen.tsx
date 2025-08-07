import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../constants/app'; // ← Agrega esta línea

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginScreen = () => {
  const { login } = useAuth();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await login(values.email, values.password);
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.title}>Ecommerce App</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {(props) => (
          <View style={styles.form}>
            <TextInput
              label="Email"
              mode="outlined"
              onChangeText={props.handleChange('email')}
              onBlur={props.handleBlur('email')}
              value={props.values.email}
              error={props.touched.email && !!props.errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            {props.touched.email && props.errors.email && (
              <Text style={styles.error}>{props.errors.email}</Text>
            )}
            
            <TextInput
              label="Password"
              mode="outlined"
              onChangeText={props.handleChange('password')}
              onBlur={props.handleBlur('password')}
              value={props.values.password}
              error={props.touched.password && !!props.errors.password}
              secureTextEntry
              style={styles.input}
            />
            {props.touched.password && props.errors.password && (
              <Text style={styles.error}>{props.errors.password}</Text>
            )}
            
            <Button
              mode="contained"
              onPress={() => props.handleSubmit()}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Login
            </Button>
            <Button 
              mode="contained"
              onPress={async () => {
                try {
                  console.log("Usando API URL:", API_URL);
                  const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      email: 'admin@example.com', 
                      password: 'admin123' 
                    })
                  });
                  console.log("Status:", response.status);
                  const data = await response.text();
                  console.log("Respuesta:", data);
                } catch (error) {
                  console.error("Error:", error);
                }
              }}
              style={styles.button}
            >
              Prueba Directa
            </Button>
            <Button 
              mode="outlined" 
              style={{ marginTop: 10 }}
              onPress={async () => {
                try {
                  const testUrl = 'http://192.168.0.123:5000/api/auth/login'; // Usa tu IP real
                  console.log("Probando URL:", testUrl);
                  
                  const response = await fetch(testUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      email: 'admin@example.com', 
                      password: 'admin123' 
                    })
                  });
                  
                  console.log("Status:", response.status);
                  const data = await response.json();
                  console.log("Respuesta:", data);
                } catch (error) {
                  console.error("Error de conexión:", error);
                }
              }}
            >
              Prueba Conexión Directa
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
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
});

export default LoginScreen;