# Cara Menambahkan Notification Sound

## Quick Setup (Copy-Paste Ready)

### Option 1: Gunakan Free Sound Library

Download notification sound dari:
- **Pixabay**: https://pixabay.com/sound-effects/search/notification/
- **Freesound**: https://freesound.org/search/?q=notification
- **Mixkit**: https://mixkit.co/free-sound-effects/notification/

Simpan sebagai `notification.mp3` di folder ini.

### Option 2: Generate Simple Beep (Base64)

Jika ingin cepat untuk testing, buat file `notification.mp3` dengan beep sederhana menggunakan online tools:
1. Buka https://www.soundjay.com/beep-sounds-1.html
2. Download "Beep 1" atau "Beep 2"
3. Rename jadi `notification.mp3`
4. Copy ke folder ini

### Option 3: Text-to-Speech Online

1. Buka https://ttstool.com/
2. Ketik "Pesan baru" atau "New message"
3. Download MP3
4. Save sebagai `notification.mp3`

## Recommended Sound Properties

- **Duration**: 0.5 - 2 seconds (jangan terlalu panjang)
- **Volume**: Not too loud (app sudah set 50% volume)
- **Format**: MP3 (most compatible)
- **Size**: < 100KB

## Testing

Setelah file ditambahkan, test dengan:
1. Buka 2 browser/tabs berbeda
2. Login sebagai 2 user berbeda
3. Kirim pesan dari user 1
4. User 2 akan dengar notification sound

## Fallback Behavior

Jika file `notification.mp3` tidak ada:
- App tetap berfungsi normal
- Hanya console log: "Notification sound not available"
- Tidak ada error yang ditampilkan ke user
