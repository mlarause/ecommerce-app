import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { API_URL } from '../constants/app';
import { useAuth } from '../contexts/AuthContext';

// Tipo para Users
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coordinator";
}

type UsersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Users'>;

const UsersScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<UsersScreenNavigationProp>();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      Alert.alert('Success', 'Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'No se pudo eliminar el usuario');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate({
          name: 'UserForm',
          params: {}  // Objeto vacío en lugar de undefined
        })}
        style={styles.addButton}
      >
        Agregar Usuario
      </Button>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item: user }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{user.name}</Title>
              <Paragraph>Email: {user.email}</Paragraph>
              <Paragraph>Rol: {user.role}</Paragraph>
              
              {currentUser && currentUser.role === 'admin' && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Button
                    icon="pencil"
                    onPress={() => navigation.navigate({
                      name: 'UserForm',
                      params: { id: user.id }
                    })}
                    style={styles.actionButton}
                  >{''}</Button>
                  
                  <Button
                    icon="delete"
                    onPress={() => handleDeleteUser(user.id)}
                    style={styles.actionButton}
                  >{''}</Button>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      />
    </View>
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

export default UsersScreen;