import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const [history, setHistory] = useState([]);

  const addToHistory = useCallback((title) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { id: Date.now().toString(), title },
    ]);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>
        This app includes example code to help you get started.
      </ThemedText>

      {/* Histori */}
      <Collapsible title="History">
        {history.length > 0 ? (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={({ item }) => (
              <ThemedText style={styles.historyItem}>{item.title}</ThemedText>
            )}
          />
        ) : (
          <ThemedText style={styles.emptyHistory}>
            No history yet. Explore the app to see history here!
          </ThemedText>
        )}
      </Collapsible>

      {/* Contoh Collapsible */}
      <Collapsible title="File-based routing" onOpen={() => addToHistory('File-based routing')}>
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>

      {/* Tambahan Collapsible lainnya */}
      <Collapsible
        title="Android, iOS, and web support"
        onOpen={() => addToHistory('Platform Support')}
      >
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  historyItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  emptyHistory: {
    padding: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
});
