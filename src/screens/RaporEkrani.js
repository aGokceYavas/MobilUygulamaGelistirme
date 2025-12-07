import { StyleSheet, Text, View } from 'react-native';

export default function RaporEkrani() {
  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Raporlar</Text>
      <Text style={styles.icerik}>
        Grafikler ve istatistikler burada gösterilecek.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baslik: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black'
  },
  icerik: {
    fontSize: 16,
    color: '#555'
  }
});