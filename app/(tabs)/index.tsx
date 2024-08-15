import { FlatList, StyleSheet, View, Text } from 'react-native';
import Card from '@/components/Card'; // Importando o Card

export default function Feed() {
  // Lista de dados dos cards
  const cardData = [
    { id: '1', title: 'Caramelo', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/600' },
    { id: '2', title: 'Luna', subtitle: 'FÊMEA', description: 'Gato', imageSource: 'https://picsum.photos/200/301' },
    { id: '3', title: 'Bobby', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/302' },
    { id: '4', title: 'Bella', subtitle: 'FÊMEA', description: 'Gato', imageSource: 'https://picsum.photos/200/303' },
    { id: '5', title: 'Max', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/304' },
    { id: '6', title: 'Mia', subtitle: 'FÊMEA', description: 'Gato', imageSource: 'https://picsum.photos/200/305' },
    { id: '7', title: 'Rex', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/306' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={cardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Card
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              imageSource={item.imageSource}
            />
          </View>
        )}
        numColumns={2} // Define que cada linha terá 2 colunas
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  otherContent: {
    marginTop: 20,
    fontSize: 16,
  },
  cardContainer: {
    flex: 1,
    margin: 8, // Espaçamento entre os cards
  },
  listContent: {
  },
});
