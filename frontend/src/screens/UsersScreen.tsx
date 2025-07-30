import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, useTheme, DataTable, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUsers, deleteUser } from '../api/users';
import { User } from '../api/users';

type UsersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Users'>;

const UsersScreen = () => {
  const { user: currentUser } = useAuth();
  const navigation = useNavigation<UsersScreenNavigationProp>();
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete user');
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
          <Title style={styles.title}>Users Management</Title>
          
          {currentUser?.role === 'admin' && (
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('UserForm')}
              style={styles.addButton}
            >
              Add User
            </Button>
          )}
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Role</DataTable.Title>
              {currentUser?.role === 'admin' && <DataTable.Title>Actions</DataTable.Title>}
            </DataTable.Header>
            
            {users.map(user => (
              <DataTable.Row key={user.id}>
                <DataTable.Cell>{user.name}</DataTable.Cell>
                <DataTable.Cell>{user.email}</DataTable.Cell>
                <DataTable.Cell>{user.role}</DataTable.Cell>
                {currentUser?.role === 'admin' && (
                  <DataTable.Cell>
                    <Button 
                      icon="pencil"
                      onPress={() => navigation.navigate('UserForm', { id: user.id })}
                      style={styles.actionButton}
                    />
                    <Button 
                      icon="delete"
                      onPress={() => handleDelete(user.id)}
                      style={styles.actionButton}
                    />
                  </DataTable.Cell>
                )}
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

export default UsersScreen;