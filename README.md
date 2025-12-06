Odaklanma Takibi ve Raporlama Uygulaması

Ders: Sakarya Üniversitesi - BSM 447 Mobil Uygulama Geliştirme Dersi
Dönem: 2025-2026 Güz
Durum: Geliştirme Aşamasında

  Proje Hakkında
Bu proje, günümüzün en büyük problemlerinden biri olan dijital dikkat dağınıklığıyla mücadele etmek için geliştirilmektedir. Uygulamanın temel amacı; kullanıcının belirlediği kategorilerde (Ders, Kodlama vb.) odaklanma seansları başlatması ve süreç boyunca uygulamadan çıkıp çıkmadığını (dikkat dağınıklığını) takip ederek raporlamasıdır.

  Özellikler (MVP)
Proje tamamlandığında aşağıdaki özellikleri içerecektir:

1. Odaklanma Sayacı: Varsayılan 25 dakikalık (Pomodoro) geri sayım aracı.
2. Kategori Yönetimi: Seansı başlatmadan önce Ders, Proje, Kitap Okuma gibi etiketleme imkanı.
3. Akıllı Takip (Smart Detection): Kullanıcı sayaç çalışırken uygulamayı arka plana atarsa (başka uygulamaya geçerse), bu durum dikkat dağınıklığı olarak kaydedilir ve sayaç duraklatılır.
4. Detaylı Raporlar:
   - Günlük ve toplam odaklanma süreleri.
   - Haftalık odaklanma grafiği (Bar Chart).
   - Kategori dağılım grafiği (Pie Chart).

  Kullanılan Teknolojiler
- Framework: React Native (Expo)
- Navigasyon: React Native Navigation (Tab & Stack)
- Veri Görselleştirme: React Native Chart Kit
- Veri Kayıt: Async Storage (Yerel Veritabanı)
- Durum Kontrolü: AppState API

  Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için:

1. Repoyu klonlayın:
   git clone https://github.com/KULLANICI_ADINIZ/OdaklanmaTakibi.git
   cd OdaklanmaTakibi

2. Paketleri yükleyin:
   npm install

3. Uygulamayı başlatın:
   npx expo start

Terminalde çıkan QR kodu Expo Go uygulaması ile okutarak test edebilirsiniz.

  Proje Yol Haritası (To-Do)
- [x] Proje oluşturulması ve konfigürasyon (Expo)
- [x] Gerekli kütüphanelerin eklenmesi (Navigation, Charts)
- [ ] Ana Sayfa (Timer) arayüz tasarımı
- [ ] AppState ile background durumunun yakalanması
- [ ] Raporlar ekranı ve grafik entegrasyonu
- [ ] README ve Dokümantasyonun güncellenmesi

---
Bu proje BSM 447 dersi dönem ödevi kapsamında geliştirilmektedir.
