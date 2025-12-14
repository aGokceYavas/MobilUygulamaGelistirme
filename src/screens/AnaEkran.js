import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AnaEkran() {
  const [kalanSure, setKalanSure] = useState(1500); 
  const [baslangicSuresi, setBaslangicSuresi] = useState(1500); 
  const [odaklanmaAktif, setOdaklanmaAktif] = useState(false);
  const [secilenKategori, setSecilenKategori] = useState('Ders');
  const [odakKesintisi, setOdakKesintisi] = useState(0); 
  
  const appStateRef = useRef(AppState.currentState);

  const [kategoriler, setKategoriler] = useState(['Ders', 'Kodlama', 'Kitap']);
  const [modalAcik, setModalAcik] = useState(false);
  const [yeniKategoriAdi, setYeniKategoriAdi] = useState('');

  useEffect(() => {
    const verileriYukle = async () => {
      try {
        const kayitliKategoriler = await AsyncStorage.getItem('kategoriListesi');
        if (kayitliKategoriler !== null) {
          setKategoriler(JSON.parse(kayitliKategoriler));
        }
      } catch (error) {
        console.log("hata", error);
      }
    };
    verileriYukle();
  }, []);

  const veriyiKaydet = async () => {
    try {
      const yeniKayit = {
        id: Date.now(),
        tarih: new Date().toISOString().split('T')[0],
        kategori: secilenKategori,
        sure: baslangicSuresi, 
        kesinti: odakKesintisi
      };

      const eskiVerilerJson = await AsyncStorage.getItem('odaklanmaVerileri');
      let eskiVeriler = eskiVerilerJson ? JSON.parse(eskiVerilerJson) : [];

      const guncelVeriler = [...eskiVeriler, yeniKayit];

      await AsyncStorage.setItem('odaklanmaVerileri', JSON.stringify(guncelVeriler));
    } catch (error) {
      console.log("hata", error);
    }
  };

  useEffect(() => {
    const durumDinleyicisi = AppState.addEventListener('change', (yeniDurum) => {
      if (
        appStateRef.current === 'active' && 
        yeniDurum.match(/inactive|background/) &&
        odaklanmaAktif
      ) {
        setOdaklanmaAktif(false);
        setOdakKesintisi((eski) => eski + 1);
        Vibration.vibrate(500);
      }
      appStateRef.current = yeniDurum;
    });
    return () => { durumDinleyicisi.remove(); };
  }, [odaklanmaAktif]);

  useEffect(() => {
    let zamanlayici = null;

    if (odaklanmaAktif && kalanSure > 0) {
      zamanlayici = setInterval(() => {
        setKalanSure((onceki) => onceki - 1);
      }, 1000);
      
    } else if (odaklanmaAktif && kalanSure === 0) { 
      setOdaklanmaAktif(false);
      clearInterval(zamanlayici);
      Vibration.vibrate(1000); 
      
      veriyiKaydet(); 

      Alert.alert(
        "Harikasın! 🎉", 
        `${secilenKategori} seansını başarıyla tamamladın.`,
        [{ text: "Tamam", onPress: () => setOdakKesintisi(0) }]
      );
    }

    return () => {
      if (zamanlayici) clearInterval(zamanlayici);
    };
  }, [odaklanmaAktif, kalanSure]);

  const sureyiFormatla = (toplamSaniye) => {
    const dk = Math.floor(toplamSaniye / 60);
    const sn = toplamSaniye % 60;
    return `${dk}:${sn < 10 ? '0' : ''}${sn}`;
  };

  const sureyiDegistir = (miktar) => {
    if (odaklanmaAktif) { Alert.alert("Bekle", "Süreyi değiştirmek için önce durdur."); return; }
    const yeniSure = kalanSure + miktar;
    
    if (yeniSure >= 0) {
      setKalanSure(yeniSure);
      setBaslangicSuresi(yeniSure); 
    }
  };

  const hizliSec = (dakika) => {
    if (odaklanmaAktif) { Alert.alert("Bekle", "Süreyi değiştirmek için önce durdur."); return; }
    
    const saniye = dakika * 60;
    setKalanSure(saniye);
    setBaslangicSuresi(saniye);
  };

  const kategoriEkle = async () => {
    if (yeniKategoriAdi.trim().length === 0) return;

    const yeniListe = [...kategoriler, yeniKategoriAdi];
    
    setKategoriler(yeniListe);
    setYeniKategoriAdi('');
    setSecilenKategori(yeniKategoriAdi);
    setModalAcik(false);

    try {
      await AsyncStorage.setItem('kategoriListesi', JSON.stringify(yeniListe));
    } catch (error) {
      console.log("hata", error);
    }
  };
  
  const sifirla = () => {
    setOdaklanmaAktif(false);
    setKalanSure(1500);
    setBaslangicSuresi(1500);
    setOdakKesintisi(0);
  };

  return (
    <View style={styles.container}>
      {/* ÜST: Kategori Seçimi */}
      <View style={styles.ustAlan}>
        <Text style={styles.baslik}>Odaklanma Takibi</Text>
        <Text style={styles.etiket}>Bugün neye odaklanacaksın?</Text>
        
        <View style={{ height: 60 }}> 
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}>
            {kategoriler.map((kat, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.kategoriButon, secilenKategori === kat && styles.seciliKategoriButon]}
                onPress={() => setSecilenKategori(kat)}
              >
                <Text style={[styles.kategoriYazi, secilenKategori === kat && styles.seciliKategoriYazi]}>{kat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[styles.kategoriButon, styles.ekleButon]}
              onPress={() => setModalAcik(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* ORTA: Sayaç */}
      <View style={styles.ortaAlan}>
        {/* Çembermsi yapı */}
        <View style={styles.sayacDaire}>
           <Text style={styles.sayacYazi}>{sureyiFormatla(kalanSure)}</Text>
           <Text style={styles.kategoriBilgi}>{secilenKategori}</Text>
        </View>

        {/* Ayar Butonları */}
        <View style={styles.kontrolSatiri}>
           <TouchableOpacity style={styles.miniBtn} onPress={() => sureyiDegistir(-60)}>
              <Ionicons name="remove" size={24} color="#555" />
           </TouchableOpacity>
           
           <View style={styles.hizliSecimKutusu}>
              {[15, 30, 45, 60].map((dk) => (
                <TouchableOpacity key={dk} onPress={() => hizliSec(dk)} style={styles.hizliTextContainer}>
                  <Text style={styles.hizliText}>{dk}dk</Text>
                </TouchableOpacity>
              ))}
           </View>

           <TouchableOpacity style={styles.miniBtn} onPress={() => sureyiDegistir(60)}>
              <Ionicons name="add" size={24} color="#555" />
           </TouchableOpacity>
        </View>
        
        {odakKesintisi > 0 && (
          <View style={styles.uyariKutusu}>
            <Text style={styles.uyariYazi}>⚠️ {odakKesintisi} kez dikkat dağıldı!</Text>
          </View>
        )}
      </View>

      {/* ALT: Başlat/Sıfırla */}
      <View style={styles.altAlan}>
        <TouchableOpacity 
          style={[styles.anaButon, odaklanmaAktif ? styles.durdurRenk : styles.baslatRenk]}
          onPress={() => setOdaklanmaAktif(!odaklanmaAktif)}
          activeOpacity={0.8}
        >
          <Text style={styles.anaButonYazi}>{odaklanmaAktif ? 'DURAKLAT' : 'ODAKLAN'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={sifirla} style={styles.sifirlaLink}>
          <Text style={styles.sifirlaYazi}>Sayacı Sıfırla</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal animationType="fade" transparent={true} visible={modalAcik} onRequestClose={() => setModalAcik(false)}>
        <View style={styles.modalArkaPlan}>
          <View style={styles.modalKutu}>
            <Text style={styles.modalBaslik}>Kategori Ekle</Text>
            <TextInput 
              style={styles.input} placeholder="Örn: Fizik, Spor..." 
              value={yeniKategoriAdi} onChangeText={setYeniKategoriAdi} autoFocus={true} 
            />
            <View style={styles.modalButonlar}>
              <TouchableOpacity style={[styles.modalBtn, styles.iptalBtn]} onPress={() => setModalAcik(false)}>
                <Text style={styles.btnText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.ekleBtn]} onPress={kategoriEkle}>
                <Text style={[styles.btnText, {color: '#fff'}]}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 60, paddingHorizontal: 20 },
  
  ustAlan: { marginBottom: 20 },
  baslik: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  etiket: { fontSize: 16, color: '#7f8c8d', marginBottom: 15 },
  
  kategoriButon: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#ecf0f1', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: {width:0, height:2} },
  seciliKategoriButon: { backgroundColor: '#2c3e50', borderColor: '#2c3e50' },
  kategoriYazi: { color: '#2c3e50', fontWeight: '600' },
  seciliKategoriYazi: { color: '#fff' },
  ekleButon: { backgroundColor: '#27ae60', borderColor: '#27ae60', paddingHorizontal: 15 },

  ortaAlan: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sayacDaire: { width: width * 0.7, height: width * 0.7, borderRadius: (width * 0.7)/2, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 8, borderColor: '#ecf0f1', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 30 },
  sayacYazi: { fontSize: 72, fontWeight: '300', color: '#2c3e50', fontVariant: ['tabular-nums'] },
  kategoriBilgi: { fontSize: 18, color: '#95a5a6', marginTop: -5, fontWeight: '500' },

  kontrolSatiri: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 },
  miniBtn: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  hizliSecimKutusu: { flexDirection: 'row', backgroundColor: '#e0e0e0', borderRadius: 20, padding: 5 },
  hizliTextContainer: { paddingHorizontal: 12, paddingVertical: 8 },
  hizliText: { fontWeight: 'bold', color: '#555' },

  uyariKutusu: { marginTop: 20, backgroundColor: '#ffebee', padding: 10, borderRadius: 8 },
  uyariYazi: { color: '#c62828', fontWeight: 'bold' },

  altAlan: { marginBottom: 40, alignItems: 'center' },
  anaButon: { width: '100%', paddingVertical: 18, borderRadius: 15, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: {width:0, height:4} },
  baslatRenk: { backgroundColor: '#2c3e50' },
  durdurRenk: { backgroundColor: '#e74c3c' },
  anaButonYazi: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  sifirlaLink: { marginTop: 15, padding: 10 },
  sifirlaYazi: { color: '#95a5a6', textDecorationLine: 'underline' },

  modalArkaPlan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalKutu: { width: '85%', backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 10 },
  modalBaslik: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#f5f6fa', borderRadius: 10, padding: 15, marginBottom: 20, fontSize: 16 },
  modalButonlar: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  iptalBtn: { backgroundColor: '#ecf0f1' },
  ekleBtn: { backgroundColor: '#2c3e50' },
  btnText: { fontWeight: 'bold', color: '#333' }
});