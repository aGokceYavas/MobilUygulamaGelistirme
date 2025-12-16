# Odaklanma Takibi (Focus Tracker)

Bu proje, Mobil Uygulama Geliştirme dersi kapsamında geliştirdiğim, kişisel verimliliği artırmayı hedefleyen bir mobil uygulamadır.

Temel amacı, çalışma esnasında telefonla ilgilenip dikkati dağılan kullanıcıları tespit etmek ve çalışma alışkanlıklarını grafiklerle raporlamaktır.

## Proje Hakkında

Uygulama, standart bir pomodoro sayacından farklı olarak kullanıcının uygulama içindeki durumunu takip eder. Eğer kullanıcı sayaç çalışırken uygulamayı arka plana atarsa (örneğin sosyal medyada gezinmek için uygulamadan çıkarsa), sistem bunu bir "odak kesintisi" olarak algılar ve kaydeder.

Tüm veriler kullanıcının cihazında yerel olarak saklanır, herhangi bir internet bağlantısı gerektirmez.

## Temel Özellikler

1. Arka Plan Takibi ve Uyarı Sistemi
Sayacı başlattığınızda uygulama açık kalmalıdır. Eğer başka bir uygulamaya geçiş yaparsanız, sayaç bunu tespit eder, titreşimle uyarı verir ve bu durumu veritabanına "kesinti" olarak işler.

2. Kategori Yönetimi
Ders, Kodlama, Kitap Okuma gibi varsayılan kategoriler mevcuttur. Ayrıca kullanıcı kendi ihtiyaçlarına göre yeni kategoriler ekleyebilir.

3. Veri Görselleştirme
Kaydedilen çalışma seansları, Rapor ekranında iki farklı grafik türüyle sunulur:
- Haftalık Grafik: Hangi gün ne kadar çalışıldığını gösteren çubuk grafik.
- Kategori Dağılımı: Hangi derse/işe ağırlık verildiğini gösteren pasta grafik.

4. Veri Kalıcılığı
Uygulama kapatılıp açılsa bile veriler kaybolmaz. Tüm kayıtlar cihazın yerel hafızasında (AsyncStorage) JSON formatında tutulur.

## Nasıl Çalışır?

Uygulamanın arkasındaki mantık şu adımlarla ilerler:

1. Kullanıcı çalışacağı kategoriyi ve süreyi seçip "Odaklan" butonuna basar.
2. Sayaç geri saymaya başlar.
3. Uygulama sürekli olarak kendi durumunu (AppState) kontrol eder.
4. Eğer durum "Active" (Ekran açık) ise sorun yoktur.
5. Eğer durum "Background" (Arka plan) olursa, sistem odaklanmanın bozulduğunu anlar ve kesinti sayacını 1 artırır.
6. Süre bittiğinde, o seansın tarihi, süresi ve kaç kez kesintiye uğradığı veritabanına kaydedilir.

## Kullanılan Teknolojiler

Bu projeyi geliştirirken aşağıdaki kütüphane ve teknolojileri kullandım:

- React Native (Expo SDK 52): Geliştirme ortamı.
- AsyncStorage: Verileri telefonda saklamak için.
- AppState API: Uygulamanın arka plana geçişini yakalamak için.
- React Native Chart Kit: Grafikleri çizdirmek için.
- React Navigation: Sayfalar arası geçiş için.

## Kurulum

Projeyi kendi bilgisayarınızda çalıştırmak isterseniz sırasıyla şu komutları terminale girebilirsiniz:

1. Projeyi bilgisayarınıza indirin:
git clone https://github.com/aGokceYavas/MobilUygulamaGelistirme.git

2. Proje klasörüne girin:
cd odaklanma-takibi

3. Gerekli paketleri yükleyin:
npm install

4. Uygulamayı başlatın:
npx expo start

## Geliştirici Notu

Bu uygulama, React Native öğrenme sürecimdeki bitirme projesidir. Veri yapısı ve algoritmalar tamamen cihaz üzerinde çalışacak şekilde optimize edilmiştir. İlerleyen aşamalarda bulut tabanlı yedekleme özelliği eklenmesi planlanmaktadır.