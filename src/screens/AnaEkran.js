import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
// Veri tabanı için kütüphaneyi çağırıyoruz
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AnaEkran() {
  // --- STATE TANIMLARI ---
  const [kalanSure, setKalanSure] = useState(1500); // Varsayılan 25 dk
  const [odaklanmaAktif, setOdaklanmaAktif] = useState(false);
  const [secilenKategori, setSecilenKategori] = useState('Ders');
  const [odakKesintisi, setOdakKesintisi] = useState(0); 
  
  const appStateRef = useRef(AppState.currentState);

  const [kategoriler, setKategoriler] = useState(['Ders', 'Kodlama', 'Kitap']);
  const [modalAcik, setModalAcik] = useState(false);
  const [yeniKategoriAdi, setYeniKategoriAdi] = useState('');

  // --- YENİ EKLENEN FONKSİYON: VERİYİ HAFIZAYA KAYDETME ---
  const veriyiKaydet = async () => {
    try {
      // 1. Kaydedilecek yeni veriyi hazırla (Obje olarak)
      const yeniKayit = {
        id: Date.now(), // Benzersiz bir numara (şu anki zaman)
        tarih: new Date().toISOString().split('T')[0], // "2025-12-08" formatında tarih
        kategori: secilenKategori,
        sure: 1500, // Şimdilik varsayılan 25 dk (ileride dinamik yapacağız)
        kesinti: odakKesintisi
      };

      // 2. Telefondaki eski kayıtları çek
      const eskiVerilerJson = await AsyncStorage.getItem('odaklanmaVerileri');
      let eskiVeriler = eskiVerilerJson ? JSON.parse(eskiVerilerJson) : [];

      // 3. Eski verilerin üzerine yenisini ekle
      const guncelVeriler = [...eskiVeriler, yeniKayit];

      // 4. Tekrar telefona kaydet
      await AsyncStorage.setItem('odaklanmaVerileri', JSON.stringify(guncelVeriler));

      // Test amaçlı konsola yazdıralım (Ctrl+J ile terminalde görebilirsin)
      console.log("✅ Veri Başarıyla Kaydedildi:", yeniKayit);
      console.log("📂 Toplam Kayıt Sayısı:", guncelVeriler.length);

    } catch (error) {
      console.log("❌ Kaydetme hatası:", error);
      Alert.alert("Hata", "Veri kaydedilirken bir sorun oluştu.");
    }
  };

  // --- DİKKAT DAĞINIKLIĞI TAKİBİ ---
  useEffect(() => {
    const durumDinleyicisi = AppState.addEventListener('change', (yeniDurum) => {
      if (
        appStateRef.current === 'active' && 
        yeniDurum.match(/inactive|background/) &&
        odaklanmaAktif
      ) {
        setOdaklanmaAktif(false);
        setOdakKesintisi((eskiSayi) => eskiSayi + 1);
        Vibration.vibrate(500);
      }
      appStateRef.current = yeniDurum;
    });
    return () => { durumDinleyicisi.remove(); };
  }, [odaklanmaAktif]);

  // --- SAYAÇ MOTORU ---
  useEffect(() => {
    let zamanlayici = null;

    if (odaklanmaAktif && kalanSure > 0) {
      // Sayaç aktif ve süre varsa azalt
      zamanlayici = setInterval(() => {
        setKalanSure((oncekiSure) => oncekiSure - 1);
      }, 1000);
      
    } else if (odaklanmaAktif && kalanSure === 0) { 
      // DÜZELTME: && odaklanmaAktif eklendi!
      // Sadece "Aktifken" 0'a düşerse bitiş işlemlerini yap.
      // Eğer zaten durmuşsa ve 0'daysa (Sıfırla denmemişse) tekrar tekrar girme.
      
      setOdaklanmaAktif(false);
      clearInterval(zamanlayici);
      Vibration.vibrate(1000); 
      
      // Kaydet ve Uyarı Ver
      veriyiKaydet(); 

      Alert.alert(
        "Tebrikler! 🎉", 
        `${secilenKategori} seansını tamamladın.\nVerilerin kaydedildi.`,
        [{ text: "Tamam", onPress: () => setOdakKesintisi(0) }]
      );
    }

    return () => {
      if (zamanlayici) clearInterval(zamanlayici);
    };
  }, [odaklanmaAktif, kalanSure]);

  // --- DİĞER FONKSİYONLAR ---
  const sureyiFormatla = (toplamSaniye) => {
    const dk = Math.floor(toplamSaniye / 60);
    const sn = toplamSaniye % 60;
    return `${dk}:${sn < 10 ? '0' : ''}${sn}`;
  };

  const sureyiDegistir = (miktar) => {
    if (odaklanmaAktif) { Alert.alert("Uyarı", "Önce durdurun."); return; }
    const yeniSure = kalanSure + miktar;
    if (yeniSure >= 0) setKalanSure(yeniSure);
  };

  const hizliSec = (dakika) => {
    if (odaklanmaAktif) { Alert.alert("Uyarı", "Önce durdurun."); return; }
    setKalanSure(dakika * 60);
  };

  // --- KATEGORİ EKLEME FONKSİYONU (GÜNCELLENDİ: ARTIK HAFIZAYA KAYDEDİYOR) ---
  const kategoriEkle = async () => {
    if (yeniKategoriAdi.trim().length === 0) {
      Alert.alert("Hata", "Kategori ismi boş olamaz.");
      return;
    }

    // 1. Yeni listeyi oluştur
    const yeniListe = [...kategoriler, yeniKategoriAdi];
    
    // 2. State'i güncelle (Ekranda görünsün)
    setKategoriler(yeniListe);
    setYeniKategoriAdi('');
    setSecilenKategori(yeniKategoriAdi);
    setModalAcik(false);

    // 3. YENİ LİSTEYİ TELEFONA KAYDET (AsyncStorage)
    try {
      await AsyncStorage.setItem('kategoriListesi', JSON.stringify(yeniListe));
      console.log("📂 Kategori Listesi Güncellendi:", yeniListe);
    } catch (error) {
      console.log("❌ Kategori kaydedilemedi:", error);
    }
  };
  
  const sifirla = () => {
    setOdaklanmaAktif(false);
    setKalanSure(1500);
    setOdakKesintisi(0);
  };

  return (
    <View style={styles.container}>
      {/* ÜST ALAN */}
      <View style={styles.ustAlan}>
        <Text style={styles.etiket}>Kategori Seç:</Text>
        <View style={{ height: 50 }}> 
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
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
              style={[styles.kategoriButon, { backgroundColor: '#e8f5e9', borderColor: '#4CAF50' }]}
              onPress={() => setModalAcik(true)}
            >
              <Ionicons name="add" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* ORTA ALAN */}
      <View style={styles.ortaAlan}>
        <View style={styles.sayacSatiri}>
          <TouchableOpacity style={styles.ayarButonu} onPress={() => sureyiDegistir(-60)}>
            <Ionicons name="remove" size={32} color="black" />
          </TouchableOpacity>
          <Text style={styles.sayacYazi}>{sureyiFormatla(kalanSure)}</Text>
          <TouchableOpacity style={styles.ayarButonu} onPress={() => sureyiDegistir(60)}>
            <Ionicons name="add" size={32} color="black" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.hizliSecimSatiri}>
          {[15, 30, 45, 60].map((dk) => (
            <TouchableOpacity key={dk} style={styles.hizliButon} onPress={() => hizliSec(dk)}>
              <Text style={styles.hizliButonYazi}>{dk}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {odakKesintisi > 0 && (
          <Text style={{ marginTop: 20, color: '#d32f2f', fontWeight: 'bold' }}>
            ⚠️ {odakKesintisi} kez odak kesintisi!
          </Text>
        )}
      </View>

      {/* ALT ALAN */}
      <View style={styles.altAlan}>
        <TouchableOpacity 
          style={[styles.anaButon, odaklanmaAktif ? styles.durdurRenk : styles.baslatRenk]}
          onPress={() => setOdaklanmaAktif(!odaklanmaAktif)}
        >
          <Text style={styles.anaButonYazi}>{odaklanmaAktif ? 'DURAKLAT' : 'BAŞLAT'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={sifirla} style={styles.sifirlaLink}>
          <Text style={styles.sifirlaYazi}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalAcik} onRequestClose={() => setModalAcik(false)}>
        <View style={styles.modalArkaPlan}>
          <View style={styles.modalKutu}>
            <Text style={styles.modalBaslik}>Yeni Kategori Ekle</Text>
            <TextInput 
              style={styles.input} placeholder="Örn: Spor, Proje..." 
              value={yeniKategoriAdi} onChangeText={setYeniKategoriAdi} autoFocus={true} 
            />
            <View style={styles.modalButonlar}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setModalAcik(false)}>
                <Text>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#4CAF50' }]} onPress={kategoriEkle}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20, justifyContent: 'space-between', paddingBottom: 20 },
  ustAlan: { height: '20%', justifyContent: 'center' },
  etiket: { fontSize: 16, color: 'gray', marginBottom: 10, textAlign: 'center' },
  kategoriButon: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#f0f0f0', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#ddd', height: 40, justifyContent: 'center' },
  seciliKategoriButon: { backgroundColor: '#333', borderColor: '#333' },
  kategoriYazi: { color: '#333' },
  seciliKategoriYazi: { color: '#fff', fontWeight: 'bold' },
  ortaAlan: { height: '50%', justifyContent: 'center', alignItems: 'center' },
  sayacSatiri: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  sayacYazi: { fontSize: 60, fontWeight: 'bold', color: '#2c3e50', marginHorizontal: 20, fontVariant: ['tabular-nums'] },
  ayarButonu: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  hizliSecimSatiri: { flexDirection: 'row' },
  hizliButon: { backgroundColor: '#e3f2fd', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginHorizontal: 5 },
  hizliButonYazi: { color: '#1565c0', fontWeight: 'bold' },
  altAlan: { height: '20%', justifyContent: 'flex-end', alignItems: 'center' },
  anaButon: { width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  baslatRenk: { backgroundColor: '#4caf50' },
  durdurRenk: { backgroundColor: '#f44336' },
  anaButonYazi: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  sifirlaLink: { marginTop: 15, padding: 10 },
  sifirlaYazi: { color: 'gray', textDecorationLine: 'underline' },
  modalArkaPlan: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalKutu: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 5 },
  modalBaslik: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 20 },
  modalButonlar: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 }
});