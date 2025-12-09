import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RaporEkrani() {
  const [toplamSure, setToplamSure] = useState(0);
  const [seansSayisi, setSeansSayisi] = useState(0);
  const [sonSeanslar, setSonSeanslar] = useState([]);

  // sayfa her açıldığında verileri güncelle
  useFocusEffect(
    useCallback(() => {
      verileriGetir();
    }, [])
  );

  const verileriGetir = async () => {
    try {
      // hafızadan oku
      const jsonVeri = await AsyncStorage.getItem('odaklanmaVerileri');
      
      if (jsonVeri !== null) {
        const veriler = JSON.parse(jsonVeri);
        
        // toplam süreyi hesapla (basit döngü)
        let toplam = 0;
        veriler.forEach(veri => {
          toplam += veri.sure;
        });

        // en yeni kayıt en üstte olsun diye ters çevir
        setSonSeanslar(veriler.reverse()); 
        setToplamSure(toplam);
        setSeansSayisi(veriler.length);
      }
    } catch (error) {
      console.log("okuma hatası", error);
    }
  };

  // saniyeyi dakikaya çevir
  const sureyiFormatla = (saniye) => {
    const dk = Math.floor(saniye / 60);
    return `${dk} dk`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Özet Rapor</Text>

      {/* özet kutuları */}
      <View style={styles.ozetKutusu}>
        <View style={styles.kutu}>
          <Text style={styles.sayi}>{seansSayisi}</Text>
          <Text style={styles.etiket}>Toplam Seans</Text>
        </View>
        <View style={styles.kutu}>
          <Text style={styles.sayi}>{sureyiFormatla(toplamSure)}</Text>
          <Text style={styles.etiket}>Toplam Süre</Text>
        </View>
      </View>

      <Text style={styles.altBaslik}>Son Kayıtlar</Text>

      {/* kayıt listesi */}
      <ScrollView style={styles.liste}>
        {sonSeanslar.map((item, index) => (
          <View key={index} style={styles.satir}>
            <View>
              <Text style={styles.kategori}>{item.kategori}</Text>
              <Text style={styles.tarih}>{item.tarih}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sure}>{sureyiFormatla(item.sure)}</Text>
              
              {/* kesinti varsa göster */}
              {item.kesinti > 0 ? (
                <Text style={styles.kesinti}>⚠️ {item.kesinti} kesinti</Text>
              ) : (
                <Text style={styles.basari}>Tam Odak 🔥</Text>
              )}
            </View>
          </View>
        ))}
        
        {sonSeanslar.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
            Henüz hiç çalışma yapmadın.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  ozetKutusu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  kutu: {
    backgroundColor: '#f8f9fa',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  sayi: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  etiket: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  altBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  liste: {
    flex: 1,
  },
  satir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  kategori: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  tarih: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  sure: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  kesinti: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 2,
  },
  basari: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  }
});