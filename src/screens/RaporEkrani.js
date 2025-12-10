import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RaporEkrani() {
  // state tanımları
  const [toplamSure, setToplamSure] = useState(0);
  const [seansSayisi, setSeansSayisi] = useState(0);
  const [sonSeanslar, setSonSeanslar] = useState([]);
  
  // sekme kontrolü
  const [aktifSekme, setAktifSekme] = useState('Haftalik');

  // verileri çek
  useFocusEffect(
    useCallback(() => {
      verileriGetir();
    }, [])
  );

  const verileriGetir = async () => {
    try {
      const jsonVeri = await AsyncStorage.getItem('odaklanmaVerileri');
      
      if (jsonVeri !== null) {
        const veriler = JSON.parse(jsonVeri);
        
        let toplam = 0;
        veriler.forEach(veri => {
          toplam += veri.sure;
        });

        setSonSeanslar(veriler.reverse()); 
        setToplamSure(toplam);
        setSeansSayisi(veriler.length);
      }
    } catch (error) {
      console.log("okuma hatası", error);
    }
  };

  const sureyiFormatla = (saniye) => {
    const dk = Math.floor(saniye / 60);
    return `${dk} dk`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>İstatistikler</Text>

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

      {/* SEKME ALANI (Düz Yazı) */}
      <View style={styles.sekmeContainer}>
        
        {/* Haftalık Sekmesi */}
        <TouchableOpacity 
          style={[styles.sekmeButon, aktifSekme === 'Haftalik' && styles.aktifSekmeButon]}
          onPress={() => setAktifSekme('Haftalik')}
        >
          <Text style={[styles.sekmeYazi, aktifSekme === 'Haftalik' && styles.aktifSekmeYazi]}>
            Haftalık
          </Text>
        </TouchableOpacity>

        {/* Kategoriler Sekmesi */}
        <TouchableOpacity 
          style={[styles.sekmeButon, aktifSekme === 'Kategori' && styles.aktifSekmeButon]}
          onPress={() => setAktifSekme('Kategori')}
        >
          <Text style={[styles.sekmeYazi, aktifSekme === 'Kategori' && styles.aktifSekmeYazi]}>
            Kategoriler
          </Text>
        </TouchableOpacity>
      </View>

      {/* İÇERİK ALANI */}
      <View style={styles.icerikAlani}>
        
        {/* DURUM 1: HAFTALIK */}
        {aktifSekme === 'Haftalik' && (
          <ScrollView style={styles.liste} showsVerticalScrollIndicator={false}>
            {/* grafik yeri */}
            <View style={styles.grafikPlaceholder}>
              <Text style={{color: 'gray'}}>-- Çubuk Grafik Alanı --</Text>
            </View>

            <Text style={styles.altBaslik}>Son Çalışmaların</Text>
            
            {sonSeanslar.map((item, index) => (
              <View key={index} style={styles.satir}>
                <View>
                  <Text style={styles.kategori}>{item.kategori}</Text>
                  <Text style={styles.tarih}>{item.tarih}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.sure}>{sureyiFormatla(item.sure)}</Text>
                  {item.kesinti > 0 ? (
                    <Text style={styles.kesinti}>⚠️ {item.kesinti} kesinti</Text>
                  ) : (
                    <Text style={styles.basari}>Tam Odak 🔥</Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* DURUM 2: KATEGORİ */}
        {aktifSekme === 'Kategori' && (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {/* pasta grafik yeri */}
            <View style={[styles.grafikPlaceholder, { height: 250, width: 250, borderRadius: 125 }]}>
               <Text style={{color: 'gray'}}>-- Pasta Grafik Alanı --</Text>
            </View>
            <Text style={{ marginTop: 20, color: 'gray' }}>Kategori bazlı dağılım burada olacak.</Text>
          </View>
        )}

      </View>
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
    marginBottom: 20,
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
  sayi: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  etiket: { fontSize: 14, color: 'gray', marginTop: 5 },
  
  sekmeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  sekmeButon: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  aktifSekmeButon: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sekmeYazi: { color: 'gray', fontWeight: '500', fontSize: 15 },
  aktifSekmeYazi: { color: '#333', fontWeight: 'bold' },

  icerikAlani: { flex: 1 },
  
  grafikPlaceholder: {
    height: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  
  altBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  liste: { flex: 1 },
  satir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  kategori: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  tarih: { fontSize: 12, color: 'gray', marginTop: 4 },
  sure: { fontWeight: 'bold', color: '#4CAF50' },
  kesinti: { fontSize: 12, color: '#e74c3c', marginTop: 2 },
  basari: { fontSize: 12, color: '#4CAF50', marginTop: 2 }
});