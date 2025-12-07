import { StyleSheet, Text, View } from 'react-native';

export default function AnaEkran() {
  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Odaklanma Sayacı</Text>
      
      {/* Basit bir sayaç görüntüsü */}
      <Text style={styles.sayacText}>25:00</Text> 
      
      <Text style={styles.bilgiText}>
        ("Başlat" butonu buraya eklenecek)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  sayacText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  bilgiText: {
    marginTop: 20,
    color: 'gray',
    fontStyle: 'italic'
  }
});