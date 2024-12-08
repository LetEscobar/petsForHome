import * as React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

interface CardProps {
  name: string;
  sex: string;
  type: string;
  images: string[]; // Imagens como um array
}

const Card: React.FC<CardProps> = ({ name, sex, type, images }) => {
  const fallbackImage = "https://res.cloudinary.com/dvjtr3on8/image/upload/v1733663318/samples/cloudinary-icon.png";

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {/* Verificando se há imagens e exibindo a primeira, ou a imagem fallback */}
        <Image
          style={styles.cardImage}
          resizeMode="cover"
          source={{ uri: images.length > 0 ? images[0] : fallbackImage }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{name || 'Sem nome'}</Text> {/* Fallback para título */}
        <Text style={styles.subtitle}>{type || 'Sem tipo'}</Text> {/* Tipo do pet */}
        <Text style={styles.description}>{sex || 'Sem sexo'}</Text> {/* Sexo do pet */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    shadowOpacity: 1,
    elevation: 5,
    width: '100%',
  },
  imageContainer: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181c",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#11181c",
    textTransform: "uppercase",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#71717a",
  },
});

export default Card;
