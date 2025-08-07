import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Title, useTheme, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>Bienvenido, {user?.name}</Title>
          <Text style={styles.roleText}>Rol: {user?.role === 'admin' ? 'Administrador' : 'Coordinador'}</Text>
          
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Gestión de Usuarios</Title>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a Usuarios')} // ← Cambio línea 23
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ver Usuarios
            </Button>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Gestión de Categorías</Title>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a Categorías')} // ← Cambio línea 35
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ver Categorías
            </Button>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Gestión de Subcategorías</Title>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a Subcategorías')} // ← Cambio línea 47
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ver Subcategorías
            </Button>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Gestión de Productos</Title>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a Productos')} // ← Cambio línea 59
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Ver Productos
            </Button>
          </View>

          <Button 
            mode="outlined" 
            onPress={logout}
            style={styles.logoutButton}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: colors.error }}
          >
            Cerrar Sesión
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    margin: 5,
    borderRadius: 10,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#444',
  },
  button: {
    marginVertical: 5,
    borderRadius: 8,
    paddingVertical: 5,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 20,
    borderColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 5,
  },
});

export default HomeScreen;