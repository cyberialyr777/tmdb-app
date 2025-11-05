import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import apiClient from '../../api/tmdb';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

const MovieItem = ({ movie }: { movie: Movie }) => (
  <View style={styles.itemContainer}>
    <Image
      source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
      style={styles.poster}
      resizeMode="cover"
    />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.overview} numberOfLines={3}>{movie.overview}</Text>
      <Text style={styles.releaseDate}>Estreno: {movie.release_date}</Text>
    </View>
  </View>
);

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiClient.get<{ results: Movie[] }>('/movie/rutaquenoexiste');

        if (response.status === 200) {
          setMovies(response.data.results);
          setError(null);
        }
      } catch (err: any) { 
        let errorMessage = 'Ocurrió un error inesperado.';
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            errorMessage = 'Error 401: Autenticación fallida. Revisa tu Token de API.';
          } else if (status === 404) {
            errorMessage = 'Error 404: El recurso que buscas no fue encontrado.';
          }
        } else {
          errorMessage = 'Error de red. Revisa tu conexión a internet.';
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Cargando películas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {}
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieItem movie={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        ListHeaderComponent={<Text style={styles.header}>Películas Populares</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#f0f0f0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overview: {
    fontSize: 12,
    color: '#666',
    marginVertical: 5,
  },
  releaseDate: {
    fontSize: 12,
    color: '#333',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});