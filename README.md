Odaklanma Takibi ve Raporlama Uygulaması

[cite_start]**Ders:** Sakarya Üniversitesi - BSM 447 Mobil Uygulama Geliştirme Dersi [cite: 2, 3, 4]  
**Dönem:** 2025-2026 Güz  
**Durum:** Geliştirme Aşamasında 🚧

Proje Hakkında
[cite_start]Bu proje, günümüzün en büyük problemlerinden biri olan **dijital dikkat dağınıklığıyla** mücadele etmek için geliştirilmektedir[cite: 7]. [cite_start]Uygulamanın temel amacı; kullanıcının belirlediği kategorilerde (Ders, Kodlama vb.) odaklanma seansları başlatması ve süreç boyunca uygulamadan çıkıp çıkmadığını (dikkat dağınıklığını) takip ederek raporlamasıdır[cite: 8, 9].

Özellikler (MVP)
[cite_start]Proje tamamlandığında aşağıdaki özellikleri içerecektir[cite: 10]:

* [cite_start]**Odaklanma Sayacı:** Varsayılan 25 dakikalık (Pomodoro) geri sayım aracı[cite: 17].
* [cite_start]**Kategori Yönetimi:** Seansı başlatmadan önce "Ders", "Proje", "Kitap Okuma" gibi etiketleme imkanı[cite: 19].
* [cite_start]**Akıllı Takip (Smart Detection):** Kullanıcı sayaç çalışırken uygulamayı arka plana atarsa (başka uygulamaya geçerse), bu durum "dikkat dağınıklığı" olarak kaydedilir ve sayaç duraklatılır[cite: 23].
Detaylı Raporlar:**
  [cite_start]Günlük ve toplam odaklanma süreleri[cite: 28, 30].
  [cite_start]Haftalık odaklanma grafiği (Bar Chart)[cite: 34].
  [cite_start]Kategori dağılım grafiği (Pie Chart)[cite: 35].

Kullanılan Teknolojiler
[cite_start]**Framework:** React Native (Expo) [cite: 5]
[cite_start]**Navigasyon:** React Native Navigation (Tab & Stack) [cite: 12]
[cite_start]**Veri Görselleştirme:** React Native Chart Kit [cite: 32]
[cite_start]**Veri Kayıt:** Async Storage (Yerel Veritabanı) [cite: 26]
[cite_start]**Durum Kontrolü:** AppState API [cite: 21]

Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için:

1.  **Repoyu klonlayın:**
    ```bash
    git clone [https://github.com/KULLANICI_ADINIZ/OdaklanmaTakibi.git](https://github.com/KULLANICI_ADINIZ/OdaklanmaTakibi.git)
    cd OdaklanmaTakibi
    ```

2.  **Paketleri yükleyin:**
    ```bash
    npm install
    ```

3.  **Uygulamayı başlatın:**
    ```bash
    npx expo start
    ```
    [cite_start]Terminalde çıkan QR kodu **Expo Go** uygulaması ile okutarak test edebilirsiniz[cite: 37].

Proje Yol Haritası (To-Do)
- [x] Proje oluşturulması ve konfigürasyon (Expo)
- [x] Gerekli kütüphanelerin eklenmesi (Navigation, Charts)
- [ ] Ana Sayfa (Timer) arayüz tasarımı
- [ ] AppState ile background durumunun yakalanması
- [ ] Raporlar ekranı ve grafik entegrasyonu
- [ ] README ve Dokümantasyonun güncellenmesi

---
*Bu proje BSM 447 dersi dönem ödevi kapsamında geliştirilmektedir.*
