import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from "react-native-chart-kit";

export default function RaporEkrani() {
  const [toplamSure, setToplamSure] = useState(0);
  const [seansSayisi, setSeansSayisi] = useState(0);
  const [sonSeanslar, setSonSeanslar] = useState([]);
  const [aktifSekme, setAktifSekme] = useState('Haftalik');

  const [grafikVerisi, setGrafikVerisi] = useState({
    labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

  const [pastaVerisi, setPastaVerisi] = useState([]);

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
        
        haftalikVeriHazirla(veriler);
        kategoriVeriHazirla(veriler);
      } else {
        sifirla();
      }
    } catch (error) {
      console.log("hata", error);
    }
  };

  const verileriTemizle = () => {
    Alert.alert(
      "Verileri Temizle",
      "Tüm istatistikler sıfırlanacak. Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Evet, Hepsini Sil", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('odaklanmaVerileri');
              sifirla(); 
            } catch (e) { console.log(e); }
          }
        }
      ]
    );
  };

  const sifirla = () => {
    setSonSeanslar([]);
    setToplamSure(0);
    setSeansSayisi(0);
    setGrafikVerisi({
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
    });
    setPastaVerisi([]);
  };

  const haftalikVeriHazirla = (veriler) => {
    const sonuclar = [0, 0, 0, 0, 0, 0, 0]; 
    veriler.forEach(item => {
      const parcalar = item.tarih.split('-'); 
      const tarihObj = new Date(parcalar[0], parcalar[1] - 1, parcalar[2]);
      const gunIndex = tarihObj.getDay(); 
      const duzeltilmisIndex = gunIndex === 0 ? 6 : gunIndex - 1;
      sonuclar[duzeltilmisIndex] += Math.floor(item.sure / 60);
    });
    setGrafikVerisi({
      labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
      datasets: [{ data: sonuclar }]
    });
  };

  const kategoriVeriHazirla = (veriler) => {
    const gruplar = {};
    veriler.forEach(item => {
      if (!gruplar[item.kategori]) gruplar[item.kategori] = 0;
      gruplar[item.kategori] += Math.floor(item.sure / 60);
    });
    const renkler = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#a29bfe', '#fab1a0'];
    let index = 0;
    const sonucDizisi = Object.keys(gruplar).map(kategoriAdi => {
      const veri = {
        name: kategoriAdi,
        population: gruplar[kategoriAdi],
        color: renkler[index % renkler.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      };
      index++;
      return veri;
    });
    setPastaVerisi(sonucDizisi);
  };

  const sureyiFormatla = (saniye) => {
    const dk = Math.floor(saniye / 60);
    return `${dk} dk`;
  };

  const tarihiGuzellestir = (isoTarih) => {
    const parcalar = isoTarih.split('-');
    return `${parcalar[2]}.${parcalar[1]}.${parcalar[0]}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.baslikSatiri}>
        <Text style={styles.baslik}>İstatistikler</Text>
        <TouchableOpacity onPress={verileriTemizle} style={styles.silBtn}>
          <Text style={styles.silYazi}>Geçmişi Temizle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ozetKutusu}>
        <View style={styles.kutu}>
          <Text style={styles.sayi}>{seansSayisi}</Text>
          <Text style={styles.etiket}>SEANS</Text>
        </View>
        <View style={styles.kutu}>
          <Text style={styles.sayi}>{sureyiFormatla(toplamSure)}</Text>
          <Text style={styles.etiket}>SÜRE</Text>
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
            <View style={styles.grafikKonteyner}>
              <BarChart
                data={grafikVerisi}
                width={Dimensions.get("window").width - 50}
                height={220}
                yAxisSuffix="dk"
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  barPercentage: 0.7,
                }}
                style={{ borderRadius: 10 }}
                fromZero={true} showValuesOnTopOfBars={true}
              />
            </View>

            <Text style={styles.altBaslik}>Geçmiş Seanslar</Text>
            {sonSeanslar.length > 0 ? (
              sonSeanslar.map((item, index) => (
                <View key={index} style={styles.kart}>
                  <View style={styles.kartSol}>
                    <Text style={styles.kategoriBaslik}>{item.kategori}</Text>
                    <Text style={styles.tarihText}>{tarihiGuzellestir(item.tarih)}</Text>
                  </View>
                  <View style={styles.kartSag}>
                    <Text style={styles.sureText}>{sureyiFormatla(item.sure)}</Text>
                    {item.kesinti > 0 ? (
                      <Text style={styles.kesintiText}>⚠️ {item.kesinti} kesinti</Text>
                    ) : (
                      <Text style={styles.basariText}>🔥 Mükemmel</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.bosMesaj}>Henüz bir kayıt yok.</Text>
            )}
            <View style={{height: 20}} />
          </ScrollView>
        )}

        {aktifSekme === 'Kategori' && (
          <View style={{ alignItems: 'center', flex: 1 }}>
             {pastaVerisi.length > 0 ? (
               <View style={styles.grafikKonteyner}>
                 <PieChart
                    data={pastaVerisi}
                    width={Dimensions.get("window").width - 40}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    absolute 
                  />
               </View>
             ) : (
               <Text style={styles.bosMesaj}>Veri yok.</Text>
             )}
             <Text style={{ marginTop: 20, color: '#95a5a6' }}>Kategori Dağılımı</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 60 },
  
  baslikSatiri: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  baslik: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  silBtn: { padding: 5 },
  silYazi: { color: '#e74c3c', fontSize: 13, fontWeight: '600' },

  ozetKutusu: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  kutu: { backgroundColor: '#fff', width: '48%', padding: 15, borderRadius: 15, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset:{width:0, height:2} },
  sayi: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },
  etiket: { fontSize: 11, color: '#95a5a6', marginTop: 5, letterSpacing: 1, fontWeight: 'bold' },

  sekmeContainer: { flexDirection: 'row', backgroundColor: '#ecf0f1', borderRadius: 12, padding: 4, marginBottom: 20 },
  sekmeButon: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  aktifSekmeButon: { backgroundColor: '#fff', elevation: 1 },
  sekmeYazi: { color: '#7f8c8d', fontWeight: '600', fontSize: 14 },
  aktifSekmeYazi: { color: '#2c3e50', fontWeight: 'bold' },

  icerikAlani: { flex: 1 },
  grafikKonteyner: { alignItems: 'center', backgroundColor: '#fff', marginBottom: 20, borderRadius: 15, padding: 10, elevation: 2 },
  altBaslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#34495e', marginLeft: 5 },
  
  liste: { flex: 1 },
  kart: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, shadowOffset:{width:0, height:1} },
  kartSol: { justifyContent: 'center' },
  kategoriBaslik: { fontWeight: 'bold', fontSize: 16, color: '#2c3e50' },
  tarihText: { fontSize: 12, color: '#95a5a6', marginTop: 3 },
  kartSag: { alignItems: 'flex-end', justifyContent: 'center' },
  sureText: { fontWeight: 'bold', fontSize: 16, color: '#27ae60' },
  kesintiText: { fontSize: 12, color: '#e74c3c', marginTop: 2, fontWeight: '500' },
  basariText: { fontSize: 12, color: '#f39c12', marginTop: 2, fontWeight: '500' },
  bosMesaj: { textAlign: 'center', marginTop: 30, color: '#bdc3c7', fontStyle: 'italic' }
});