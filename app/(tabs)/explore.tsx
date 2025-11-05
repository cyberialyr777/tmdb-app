import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { getImageUrl, searchMovies } from '@/api/tmdb';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
};

export default function ExploreSearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce: wait a bit after the user stops typing
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query || query.trim().length < 2) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await searchMovies(query.trim(), 1, 'es-ES');
        setResults(data.results ?? []);
      } catch (e: any) {
        let message = 'No se pudo buscar películas.';
        if (e?.response?.status === 401) message = 'Token inválido o faltante.';
        else if (e?.response?.status === 429) message = 'Límite de peticiones alcanzado. Intenta más tarde.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  const header = useMemo(() => (
    <ThemedView style={styles.headerWrap}>
      <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
        Buscar películas
      </ThemedText>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Busca por título (mín. 2 letras)"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  ), [query]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="magnifyingglass"
          style={styles.headerImage}
        />
      }
    >
      {header}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color="#007AFF" />
          <ThemedText style={{ marginTop: 8 }}>Buscando…</ThemedText>
        </View>
      )}
      {!!error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
        <View style={styles.centered}>
          <ThemedText>No hay resultados.</ThemedText>
        </View>
      )}
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieRow movie={item} />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}
      />
    </ParallaxScrollView>
  );
}

function MovieRow({ movie }: { movie: Movie }) {
  const poster = getImageUrl(movie.poster_path, 'w185');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '—';
  return (
    <View style={styles.card}>
      {!!poster ? (
        <Image source={{ uri: poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterFallback]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.meta}>Año: {year}</Text>
        <Text style={styles.overview} numberOfLines={3}>{movie.overview}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  headerWrap: {
    paddingHorizontal: 12,
    gap: 12,
    paddingBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
  },
  clearBtn: {
    marginLeft: 8,
    backgroundColor: '#eee',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 20,
    color: '#333',
    lineHeight: 20,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  poster: {
    width: 90,
    height: 135,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111',
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  overview: {
    fontSize: 13,
    color: '#444',
  },
});
