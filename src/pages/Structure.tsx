import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Structure = () => {
  const structure = [
    {
      position: "Ketua",
      name: "Ahmad Fauzi",
      class: "XII RPL 1",
    },
    {
      position: "Wakil Ketua",
      name: "Siti Nurhaliza",
      class: "XII RPL 2",
    },
    {
      position: "Sekretaris",
      name: "Muhammad Rizki",
      class: "XI RPL 1",
    },
    {
      position: "Bendahara",
      name: "Fatimah Azzahra",
      class: "XI RPL 2",
    },
    {
      position: "Koordinator Kajian",
      name: "Abdullah Zaky",
      class: "XII TKJ 1",
    },
    {
      position: "Koordinator Humas",
      name: "Aisyah Rahman",
      class: "XII TKJ 2",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Struktur Organisasi
          </h1>
          <p className="text-muted-foreground">
            Kenali pengurus IRMA SMK Negeri 13 Bandung periode 2024/2025
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {structure.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20 bg-gradient-primary">
                    <AvatarFallback className="text-primary-foreground text-2xl font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-lg">{member.position}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-foreground mb-1">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.class}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Structure;
