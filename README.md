# 🧠 CENG316 Full Stack Projesi

Bu proje, React (frontend) ve Python FastAPI (backend) kullanılarak geliştirilmiş bir full-stack web uygulamasıdır. Tüm ekip üyeleri kendi branch'lerinde çalışacak ve pull request yoluyla katkıda bulunacaktır.

---

## 🚀 Hızlı Başlangıç (Kısayol Komutlar)
sudo apt update && sudo apt install -y make

```bash
# Eğer sisteminizde make yüklü değilse:
sudo apt update
sudo apt install make

git clone https://github.com/AkifCanSonmez/CENG316-Project
cd CENG316-Project

# 1️⃣ Sistem bağımlılıklarını kur (sadece 1 kez çalıştırılır)
make setup-system

# 2️⃣ Proje bağımlılıklarını yükle
make setup-project

# 3️⃣ Geliştirmeye başla (frontend + backend aynı anda açılır)
make run
```

---

## ⚙️ Gereksinimler

- Linux işletim sistemi (Ubuntu önerilir)
- Git
- curl, wget
- sudo yetkisi
- Miniconda (otomatik kurulur)
- Node.js & npm (otomatik kurulur)

---

## 🧪 Makefile Komutları

| Komut               | Açıklama                                                                 |
|--------------------|--------------------------------------------------------------------------|
| `make setup-system`| Miniconda, Node.js gibi sistem bağımlılıklarını kurar                    |
| `make setup-project`| Conda ortamı ve React bağımlılıklarını yükler (`npm install`)           |
| `make run`          | React ve FastAPI sunucusunu ayrı terminallerde başlatır                 |
| `make clean`        | Ortamı sıfırlar (node_modules, build, conda environment)                |

---

## 🔀 Branch Kullanımı

Projede her öğrenci kendi branch’inde çalışmalıdır:

```bash
git checkout -b isim-soyisim
```

Kod değişiklikleri sadece pull request (PR) ile `main` branch’ine merge edilecektir.

---

## 🧰 Yeni Linux Kurulumu Yapanlar İçin Mini Rehber

Eğer bilgisayarınıza yeni Linux kurduysanız, aşağıdaki adımlarla kullanıcı oluşturup root yetkisi verebilirsiniz.

### 👤 1. Yeni Kullanıcı Oluştur

```bash
sudo adduser kullanici_adi
```

### 🔐 2. Kullanıcıya Sudo Yetkisi Ver

```bash
sudo usermod -aG sudo kullanici_adi
```

### 🔁 3. Kullanıcıya Geçiş Yap

```bash
su - kullanici_adi
```

veya bilgisayarı yeniden başlat:

```bash
reboot
```

### ✅ 4. Sudo Testi

```bash
sudo apt update
```

Bu komut sorunsuz çalışıyorsa her şey hazır demektir.

---

## 📬 Destek

Kurulumda sorun yaşarsanız Akif Can Sönmez ile iletişime geçin.
