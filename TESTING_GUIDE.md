# 🔍 Global Search Feature - Testing Guide

## ✅ Status
Fitur Global Search **telah berhasil diimplementasikan dan siap digunakan!**

## 📋 Fitur yang Tersedia

### 1. Real-time Search dengan Debounce
- Search dijalankan otomatis saat mengetik (dengan debounce 300ms)
- Minimum 2 karakter untuk memulai search
- Dropdown results muncul otomatis

### 2. Multiple Search Categories
Search mencakup:
- 📰 **Berita** - Judul, Deskripsi, Content
- 👤 **Pengguna** - Nama, Email, Bio
- 🎓 **Instruktur** - Nama, Bidang Keahlian, Pengalaman

### 3. Responsive Design
- Desktop: Search bar di header (hidden md ke bawah)
- Mobile: Search bar di bawah header
- Full search results page di `/search?q=<query>`

## 🧪 Testing Guide

### Testing di Development

#### 1. Start Server
```bash
cd c:\laragon\www\irmaverse
pnpm run dev
```
Server akan berjalan di `http://localhost:3000`

#### 2. Test Search Bar
1. Buka browser di `http://localhost:3000`
2. Lihat header - ada search bar di tengah (desktop) atau bawah (mobile)
3. Mulai ketik minimal 2 karakter, misal: "test", "berita", "admin"
4. Dropdown akan menampilkan hasil yang dikelompokkan

#### 3. Test Berbagai Query
Coba search dengan:
- **Untuk berita**: ketik judul berita yang ada
- **Untuk pengguna**: ketik nama atau email user
- **Untuk instruktur**: ketik nama atau bidang keahlian instruktur

#### 4. Test Full Search Results
1. Dari dropdown search, klik "Lihat semua hasil →"
2. Atau langsung akses: `http://localhost:3000/search?q=<query>`
3. Page akan menampilkan:
   - Semua hasil search
   - Tab filter (Semua, Berita, Pengguna, Instruktur)
   - Hasil count per kategori
   - Link ke detail masing-masing item

### Expected Behavior

#### Dropdown Results
```
┌─────────────────────────────────────┐
│ 📰 Berita (3)                       │
│ ├─ [Image] Judul Berita             │
│ ├─ [Image] Berita Lainnya           │
│ └─ [Image] Berita Ketiga            │
│                                      │
│ 👤 Pengguna (2)                     │
│ ├─ Nama User 1 (email@...)          │
│ └─ Nama User 2 (email@...)          │
│                                      │
│ 🎓 Instruktur (1)                   │
│ └─ Nama Instruktur (Bidang Keahlian)│
│                                      │
│ Lihat semua hasil →                 │
└─────────────────────────────────────┘
```

#### Click Behavior
- **Berita**: Navigate ke `/news/[slug]`
- **Pengguna**: Navigate ke `/members/[id]`
- **Instruktur**: Navigate ke `/instructors`

## 🔧 Technical Details

### Files Created/Modified

#### Created:
1. **`app/api/search/route.ts`** - Search API endpoint
   - GET `/api/search?q=<query>`
   - Returns grouped results (berita, pengguna, instruktur)

2. **`components/ui/SearchBar.tsx`** - Search bar component
   - Real-time search dengan debounce
   - Dropdown results
   - Responsive design

3. **`app/search/page.tsx`** - Full search results page
   - Display semua hasil
   - Filter tabs
   - Result count

#### Modified:
1. **`components/ui/DashboardHeader.tsx`**
   - Integrated SearchBar component
   - Removed inline search input

#### Documentation:
1. **`SEARCH_FEATURE.md`** - Feature documentation
2. **`TESTING_GUIDE.md`** - This file

### Dependencies Added
```json
{
  "lodash": "^4.17.21",
  "@types/lodash": "^4.17.23"
}
```

## 📊 API Response Example

### Request
```
GET /api/search?q=test
```

### Response
```json
{
  "results": [
    {
      "id": "news-1",
      "type": "news",
      "title": "Berita Testing",
      "slug": "berita-testing",
      "description": "Deskripsi berita...",
      "image": "url-image",
      "category": "Update"
    },
    {
      "id": "user-1",
      "type": "user",
      "title": "Test User",
      "email": "test@example.com",
      "role": "user",
      "bio": "Bio user..."
    },
    {
      "id": "instr-1",
      "type": "instructor",
      "title": "Instructor Test",
      "bidangKeahlian": "Testing & QA",
      "pengalaman": "5 tahun pengalaman..."
    }
  ],
  "query": "test"
}
```

## 🚀 Performance Optimizations

✅ **Implemented:**
- Debounce 300ms - Mengurangi API calls
- Minimum 2 karakter - Mengurangi load
- Max 5 hasil per kategori - Fast dropdown
- LIKE query - MySQL optimized

🔮 **Potential Improvements:**
- Add database indexes pada search fields
- Implement caching untuk popular searches
- Add search ranking/relevance scoring
- Add search analytics

## 📱 Responsive Breakpoints

### Desktop (md ke atas)
- Search bar di tengah header
- Max width 420px
- Full dropdown

### Mobile (di bawah md)
- Search bar di bawah header
- Full width
- Optimized dropdown

## 🐛 Troubleshooting

### Search tidak menampilkan hasil
**Solution:**
- Check di browser DevTools Network tab
- Verifikasi API endpoint: `http://localhost:3000/api/search?q=test`
- Check console untuk error messages
- Pastikan database sudah populated dengan data

### Dropdown tidak menutup saat klik di luar
**Solution:**
- Component sudah punya click-outside handler
- Jika masih issue, check `searchRef` di component

### Performance lambat
**Solution:**
- Reduce `take` value di API route (default 5)
- Increase debounce delay (default 300ms)
- Add database indexes

## 🎯 Next Steps

Untuk extend fitur:

### 1. Add "Kajian" Search
Update `app/api/search/route.ts`:
```tsx
const kajianResults = await prisma.kajian.findMany({
  where: { title: { contains: query } },
  take: 5,
});
```

Add ke SearchBar dropdown:
```tsx
{groupedResults.kajian.length > 0 && (
  <div>
    <div className="px-4 py-2 text-xs font-semibold">📚 Kajian</div>
    {/* render hasil */}
  </div>
)}
```

### 2. Add Search History
- Save search queries di localStorage
- Display "Recent Searches" di dropdown

### 3. Add Advanced Filters
- Filter by date range
- Filter by category
- Filter by author

### 4. Search Analytics
- Track popular searches
- Track failed searches
- Usage patterns

## ✨ Best Practices

1. **Always add minimum query length** - Kurangi load pada server
2. **Use debounce** - Mencegah spam API calls
3. **Limit results** - Faster response, better UX
4. **Group by category** - Lebih mudah dipahami user
5. **Handle loading state** - User aware ada yang loading
6. **Handle empty state** - User friendly message

---

**Server Status:** ✅ Running
**Last Updated:** January 19, 2026
**Testing Version:** v1.0.0

---

## 📞 Support

Jika ada issues atau pertanyaan tentang search feature:
1. Check SEARCH_FEATURE.md untuk dokumentasi lengkap
2. Check browser console untuk error messages
3. Check Prisma logs untuk database queries
