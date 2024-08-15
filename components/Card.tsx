import * as React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

interface CardProps {
  title: string;
  subtitle: string;
  description: string;
  imageSource: string; // Adicionado para permitir passar a imagem como prop
}

const Card: React.FC<CardProps> = ({ title, subtitle, description, imageSource }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.cardImage}
          resizeMode="cover"
          source={{ uri: imageSource }} // Utilizando a prop para a imagem
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.description}>{description}</Text>
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
    width: '100%', // Garantir que o card ocupe a largura total disponível
  },
  imageContainer: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 150, // Altura fixa para a imagem
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
