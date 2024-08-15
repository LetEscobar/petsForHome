import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'dog' && styles.activeFilter]}
        onPress={() => setActiveFilter('dog')}
      >
        <Text style={styles.filterText}>Cachorro</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'cat' && styles.activeFilter]}
        onPress={() => setActiveFilter('cat')}
      >
        <Text style={styles.filterText}>Gato</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    color: '#11181c',
  },
});

export default Filter;
