# Global Search Feature

## Overview
Fitur Global Search memungkinkan pengguna mencari di berbagai jenis data dalam platform IRMAVERSE:
- 📰 **Berita** - Mencari berdasarkan judul, deskripsi, dan konten
- 👤 **Pengguna** - Mencari berdasarkan nama, email, dan bio
- 🎓 **Instruktur** - Mencari berdasarkan nama, bidang keahlian, dan pengalaman
- 📚 **Kajian/Event** - Siap untuk integrasi di masa depan

## Komponen & File yang Dibuat

### 1. **SearchBar Component** (`components/SearchBar.tsx`)
Komponen utama search bar yang dapat digunakan di seluruh aplikasi.

**Features:**
- Real-time search dengan debounce 300ms
- Dropdown results yang dikelompokkan berdasarkan tipe
- Responsive design (mobile & desktop)
- Loading state indicator
- Clear button
- Keyboard support (ESC untuk close)

**Props:** Tidak ada (menggunakan Next.js hooks secara internal)

**Usage:**
```tsx
import SearchBar from "@/components/SearchBar";

export default function Header() {
  return <SearchBar />;
}
```

### 2. **Search API Route** (`app/api/search/route.ts`)
Endpoint API untuk melakukan search di database.

**Endpoint:** `GET /api/search?q=<query>`

**Query Parameters:**
- `q` (required) - Search query (minimum 2 karakter)

**Response:**
```json
{
  "results": [
    {
      "id": "user-id",
      "type": "news|user|instructor",
      "title": "...",
      "slug": "...",
      "description": "...",
      ...
    }
  ],
  "query": "search term"
}
```

**Fitur Search:**
- **News**: Mencari di title, deskripsi, dan content
- **Users**: Mencari di name, email, dan bio
- **Instructors**: Mencari di name, bidang keahlian, dan pengalaman
- Max 5 hasil per kategori
- Case-insensitive search

### 3. **Search Results Page** (`app/search/page.tsx`)
Halaman full search results dengan filter dan pagination.

**Features:**
- Display semua hasil search
- Tab filter (Semua, Berita, Pengguna, Instruktur)
- Hasil count per kategori
- Link ke detail page masing-masing hasil
- Responsive design
- Back button untuk kembali

**URL:** `/search?q=<query>`

### 4. **Updated DashboardHeader** (`components/ui/DashboardHeader.tsx`)
Header dashboard yang mengintegrasikan SearchBar baru.

**Changes:**
- Replace inline search input dengan SearchBar component
- Search bar tersedia di desktop dan mobile
- Maintained semua existing functionality

## Installation & Dependencies

### Baru Diinstall:
```bash
pnpm add lodash @types/lodash
```

**Version:**
- lodash: ^4.17.21
- @types/lodash: ^4.17.23

### Dependencies yang Digunakan:
- `next` - Framework
- `next/navigation` - Client-side routing
- `@prisma/client` - Database ORM
- `lucide-react` - Icons
- `lodash` - Utility functions (debounce)

## Database Integration

### Prisma Models yang Digunakan:

**User Model:**
```prisma
model User {
  id                String
  email             String
  name              String?
  bio               String?
  bidangKeahlian    String?  // For instructors
  pengalaman        String?  // For instructors
  ...
}
```

**News Model:**
```prisma
model News {
  id          String
  title       String
  slug        String
  category    String
  deskripsi   String
  content     String (LongText)
  image       String?
  ...
}
```

## Usage Examples

### 1. Menggunakan Search Bar di Komponen
```tsx
import SearchBar from "@/components/SearchBar";

export default function MyComponent() {
  return (
    <div className="flex gap-4">
      <SearchBar />
    </div>
  );
}
```

### 2. Direct API Call
```tsx
async function searchData(query: string) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.results;
}
```

### 3. Navigasi ke Search Results Page
```tsx
router.push(`/search?q=${encodeURIComponent(query)}`);
```

## Performance Optimizations

1. **Debounce**: Search dijalankan 300ms setelah user berhenti mengetik
2. **Minimum Query Length**: Minimum 2 karakter sebelum search
3. **Result Limit**: Max 5 hasil per kategori di dropdown
4. **Case-Insensitive**: Menggunakan Prisma `mode: 'insensitive'`
5. **Index**: Database fields sudah di-index untuk performa

## Fitur yang Siap di-Extend

Untuk menambahkan search untuk "Kajian" atau kategori baru:

1. **Update API Route** (`app/api/search/route.ts`):
```tsx
const kajianResults = await prisma.kajian.findMany({
  where: {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { deskripsi: { contains: query, mode: 'insensitive' } },
    ],
  },
  take: 5,
});
```

2. **Update SearchBar Component** untuk menambah section baru:
```tsx
{groupedResults.kajian.length > 0 && (
  <div>
    <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">
      📚 Kajian
    </div>
    {/* ... render kajian results ... */}
  </div>
)}
```

## Troubleshooting

### Search tidak menampilkan hasil
1. Pastikan database sudah ter-populate dengan data
2. Check Prisma schema sudah match dengan actual database
3. Verifikasi API endpoint di browser console

### Dropdown tidak menutup
- Component sudah handle click-outside behavior
- Jika issue, check `searchRef` binding di component

### Performance issue pada large datasets
- Increase debounce delay (default 300ms)
- Reduce `take` value di API route
- Add database indexes pada fields yang sering di-search

## Future Enhancements

1. **Advanced Filters**: Filter by date range, category, author
2. **Search History**: Save user search history
3. **Popular Searches**: Show trending searches
4. **Autocomplete**: Suggest queries while typing
5. **Search Analytics**: Track popular searches
6. **Search Ranking**: Improved relevance scoring

## File Structure

```
irmaverse/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API endpoint
│   └── search/
│       └── page.tsx              # Full results page
├── components/
│   ├── SearchBar.tsx             # Search bar component
│   └── ui/
│       └── DashboardHeader.tsx    # Updated header
```

---

**Last Updated:** January 19, 2026
**Status:** ✅ Production Ready
