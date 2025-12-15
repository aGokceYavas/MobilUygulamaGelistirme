Odaklanma Takibi ve Verimlilik Analizi Uygulaması


Proje Özeti:

Bu proje, kullanıcıların belirli kategoriler altında odaklanma sürelerini yönetmelerini, uygulama yaşam döngüsü (App Lifecycle) takibi ile dikkat dağınıklığını tespit etmelerini ve toplanan verileri yerel veritabanı üzerinde analiz etmelerini sağlayan bir mobil uygulamadır.

Geliştirme Ortamı: React Native (Expo SDK 52) Platform: iOS & Android

1. Teknik Mimari ve Kullanılan Teknolojiler
Proje, bileşen tabanlı (Component-Based) mimari kullanılarak geliştirilmiştir. Durum yönetimi (State Management) için React Hooks yapısı tercih edilmiş, veri kalıcılığı için asenkron depolama çözümleri kullanılmıştır.

Core Framework: React Native

Veri Kalıcılığı (Persistence): @react-native-async-storage/async-storage

Arka Plan Yönetimi: React Native AppState API

Veri Görselleştirme: react-native-chart-kit & react-native-svg

Navigasyon: @react-navigation/bottom-tabs

2. Veri Modeli ve Akış Şeması
Uygulama, ilişkisel olmayan bir veri yapısı kullanmaktadır. Veriler JSON formatında serileştirilerek cihaz hafızasında saklanır.

Veri Kayıt Yapısı (Şema):

+--------------------------------------------------+
|  odaklanmaVerileri (Array<Object>)               |
+--------------------------------------------------+
|                                                  |
|  [                                               |
|    {                                             |
|      "id": 1734123456789,      (Timestamp/Long)  |
|      "tarih": "2025-12-14",    (ISO String)      |
|      "kategori": "Ders",       (String)          |
|      "sure": 1500,             (Integer/Saniye)  |
|      "kesinti": 2              (Integer)         |
|    },                                            |
|    ...                                           |
|  ]                                               |
|                                                  |
+--------------------------------------------------+

Uygulama Çalışma Mantığı:

[BAŞLAT]
   |
   v
[SAYAÇ AKTİF] <----(Kullanıcı Etkileşimi)
   |      |
   |      +---> [Arka Plana Geçiş Tespiti (AppState)]
   |                      |
   |              [Kesinti Sayacını Artır]
   |                      |
   |              [Kullanıcıyı Uyar (Vibration)]
   |
   +---> [Süre Doldu / Manuel Durdurma]
                  |
                  v
         [Veriyi AsyncStorage'a Yaz]
                  |
                  v
         [İstatistikleri Güncelle]



3. Temel Fonksiyonlar ve Algoritmalar

A. Odaklanma ve Kesinti Takibi
Uygulama, AppState API'sini dinleyerek kullanıcının uygulamadan ayrıldığı anları (Instagram, WhatsApp vb. geçişleri) tespit eder.

Algoritma: Sayaç aktifken AppState durumu active dışına çıkarsa (inactive/background), sistem bunu bir "odak kaybı" olarak işaretler ve kesinti sayacını (odakKesintisi) artırır.

B. Veri Görselleştirme ve Analiz
Kaydedilen ham veriler, Rapor Ekranı yüklendiğinde (useFocusEffect) işlenerek iki farklı grafik türüne dönüştürülür:

Haftalık Analiz (Bar Chart): YYYY-MM-DD formatındaki tarih verisi parçalanarak (split) haftanın günlerine (Pzt-Paz) göre gruplanır (Aggregation).

Kategori Dağılımı (Pie Chart): Kategorik veriler toplanarak oransal dağılım hesaplanır.

C. Tarih Formatı Yönetimi
Veritabanı tutarlılığı için tarihler arka planda ISO 8601 (YYYY-MM-DD) standardında saklanmaktadır. Kullanıcı arayüzünde (UI) ise bu veriler istemci tarafında işlenerek yerel formata (GG.AA.YYYY) dönüştürülür.

4. Kurulum Yönergeleri
Projeyi yerel ortamda çalıştırmak için aşağıdaki adımlar izlenmelidir:

Gerekli bağımlılıkların yüklenmesi:

Bash

npm install
Uygulamanın başlatılması:

Bash

npx expo start
5. Geliştirici Notları
Manuel State Yönetimi: Proje ölçeği gereği Redux gibi harici kütüphaneler yerine, React'in kendi useState ve useEffect hook'ları ile performans optimizasyonu sağlanmıştır.

Veri Temizliği: Geliştirme ve test süreçlerini kolaylaştırmak adına, rapor ekranına tüm AsyncStorage verisini temizleyen (Hard Reset) bir fonksiyon entegre edilmiştir.