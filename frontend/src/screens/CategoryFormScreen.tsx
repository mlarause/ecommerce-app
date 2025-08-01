import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../constants/app';

type RootStackParamList = {
  CategoryForm: { id?: string };
};

const CategoryFormScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'CategoryForm'>>();
  const { id } = route.params || {};

  useEffect(() => {
    if (id) {
      setLoadingData(true);
      axios.get<{ name: string; description?: string }>(`${API_URL}/categories/${id}`)
        .then(response => {
          setName(response.data.name);
          setDescription(response.data.description || '');
          setLoadingData(false);
        })
        .catch(() => {
          Alert.alert('Error', 'No se pudo cargar la categoría');
          setLoadingData(false);
        });
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = { name, description };
      
      if (id) {
        await axios.put(`${API_URL}/categories/${id}`, data);
      } else {
        await axios.post(`${API_URL}/categories`, data);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Error al guardar');
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
        label="Nombre"
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
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={!name}
        style={styles.button}
      >
        {id ? 'Actualizar' : 'Crear'} Categoría
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

export default CategoryFormScreen;