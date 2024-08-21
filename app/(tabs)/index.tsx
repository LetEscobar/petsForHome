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
      <Text style={styles.heading}>Que tipo de pet está procurando?</Text>
      
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
        columnWrapperStyle={styles.columnWrapper} // Garante espaçamento entre as colunas
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f4f4f4',
  },
  cardContainer: {
    flex: 1,
    padding: 8, // Espaçamento entre os cards
    maxWidth: '50%', // Garante que cada card ocupe 50% da largura
  },
  columnWrapper: {
    justifyContent: 'space-between', // Espaçamento igual entre as colunas
  },
  listContent: {
    paddingHorizontal: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181c',
    textAlign: 'center',
    marginBottom: 16,
  },
});
