import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from "react-native-chart-kit";

export default function RaporEkrani() {
  const [toplamSure, setToplamSure] = useState(0);
  const [seansSayisi, setSeansSayisi] = useState(0);
  const [sonSeanslar, setSonSeanslar] = useState([]);
  const [aktifSekme, setAktifSekme] = useState('Haftalik');

  // grafiğin boş hali
  const [grafikVerisi, setGrafikVerisi] = useState({
    labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

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
        veriler.forEach(veri => { toplam += veri.sure; });

        setSonSeanslar([...veriler].reverse()); 
        setToplamSure(toplam);
        setSeansSayisi(veriler.length);
        
        // grafiği hazırla
        haftalikVeriHazirla(veriler);
      }
    } catch (error) {
      console.log("okuma hatası", error);
    }
  };

  const haftalikVeriHazirla = (veriler) => {
    const sonuclar = [0, 0, 0, 0, 0, 0, 0]; 

    veriler.forEach(item => {
      // tarihi parçala
      const parcalar = item.tarih.split('-'); 
      const tarihObj = new Date(parcalar[0], parcalar[1] - 1, parcalar[2]);
      
      const gunIndex = tarihObj.getDay(); 
      
      // pzt baştan başlasın diye
      const duzeltilmisIndex = gunIndex === 0 ? 6 : gunIndex - 1;
      
      sonuclar[duzeltilmisIndex] += Math.floor(item.sure / 60);
    });

    setGrafikVerisi({
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      datasets: [{ data: sonuclar }]
    });
  };

  const sureyiFormatla = (saniye) => {
    const dk = Math.floor(saniye / 60);
    return `${dk} dk`;
  };

  // tarihi tr formatına çevir
  const tarihiGuzellestir = (isoTarih) => {
    const parcalar = isoTarih.split('-');
    return `${parcalar[2]}.${parcalar[1]}.${parcalar[0]}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>İstatistikler</Text>

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

      <View style={styles.sekmeContainer}>
        <TouchableOpacity 
          style={[styles.sekmeButon, aktifSekme === 'Haftalik' && styles.aktifSekmeButon]}
          onPress={() => setAktifSekme('Haftalik')}
        >
          <Text style={[styles.sekmeYazi, aktifSekme === 'Haftalik' && styles.aktifSekmeYazi]}>Haftalık</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.sekmeButon, aktifSekme === 'Kategori' && styles.aktifSekmeButon]}
          onPress={() => setAktifSekme('Kategori')}
        >
          <Text style={[styles.sekmeYazi, aktifSekme === 'Kategori' && styles.aktifSekmeYazi]}>Kategoriler</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.icerikAlani}>
        {aktifSekme === 'Haftalik' && (
          <ScrollView style={styles.liste} showsVerticalScrollIndicator={false}>
            
            {/* grafik alanı */}
            <View style={styles.grafikKonteyner}>
              <BarChart
                data={grafikVerisi}
                width={Dimensions.get("window").width - 40}
                height={220}
                yAxisSuffix="dk"
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 0.7,
                }}
                verticalLabelRotation={0}
                style={{ borderRadius: 10 }}
                fromZero={true} 
                showValuesOnTopOfBars={true}
              />
            </View>

            <Text style={styles.altBaslik}>Son Çalışmaların</Text>
            {sonSeanslar.map((item, index) => (
              <View key={index} style={styles.satir}>
                <View>
                  <Text style={styles.kategori}>{item.kategori}</Text>
                  <Text style={styles.tarih}>{tarihiGuzellestir(item.tarih)}</Text>
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

        {aktifSekme === 'Kategori' && (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={[styles.grafikPlaceholder, { height: 250, width: 250, borderRadius: 125 }]}>
               <Text style={{color: 'gray'}}>-- Pasta Grafik --</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
  baslik: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  ozetKutusu: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kutu: { backgroundColor: '#f8f9fa', width: '48%', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  sayi: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  etiket: { fontSize: 14, color: 'gray', marginTop: 5 },
  sekmeContainer: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5, marginBottom: 20 },
  sekmeButon: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  aktifSekmeButon: { backgroundColor: '#fff', elevation: 2 },
  sekmeYazi: { color: 'gray', fontWeight: '500', fontSize: 15 },
  aktifSekmeYazi: { color: '#333', fontWeight: 'bold' },
  icerikAlani: { flex: 1 },
  grafikKonteyner: { alignItems: 'center', backgroundColor: '#fff', marginBottom: 20, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#f0f0f0' },
  grafikPlaceholder: { height: 200, backgroundColor: '#f9f9f9', borderRadius: 15, borderWidth: 2, borderColor: '#eee', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  altBaslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  liste: { flex: 1 },
  satir: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  kategori: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  tarih: { fontSize: 12, color: 'gray', marginTop: 4 },
  sure: { fontWeight: 'bold', color: '#4CAF50' },
  kesinti: { fontSize: 12, color: '#e74c3c', marginTop: 2 },
  basari: { fontSize: 12, color: '#4CAF50', marginTop: 2 }
});