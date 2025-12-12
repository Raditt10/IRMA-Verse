import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";

const Gallery = () => {
  // Placeholder gallery items
  const galleryItems = [
    { id: 1, title: "Kajian Ramadan 2024", color: "bg-gradient-primary" },
    { id: 2, title: "Kegiatan Bakti Sosial", color: "bg-gradient-hero" },
    { id: 3, title: "Halal Bihalal 2024", color: "bg-primary" },
    { id: 4, title: "Pelatihan Tahfidz", color: "bg-accent" },
    { id: 5, title: "Lomba MTQ", color: "bg-gradient-primary" },
    { id: 6, title: "Khataman Al-Quran", color: "bg-gradient-hero" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Galeri
          </h1>
          <p className="text-muted-foreground">
            Dokumentasi kegiatan IRMA SMK Negeri 13 Bandung
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <div className={`${item.color} h-64 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <h3 className="text-primary-foreground font-semibold text-xl z-10 px-4 text-center">
                  {item.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
