import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Rating {
  id: string;
  pemateri_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const Ratings = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchRatings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from("rating_pemateri")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRatings(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Rating Pemateri
          </h1>
          <p className="text-muted-foreground">
            Penilaian terhadap pemateri kajian
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat rating...</p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada rating</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratings.map((rating) => (
              <Card key={rating.id} className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{rating.pemateri_name}</CardTitle>
                  <div className="mt-2">
                    {renderStars(rating.rating)}
                  </div>
                </CardHeader>
                {rating.comment && (
                  <CardContent>
                    <CardDescription className="text-base">
                      "{rating.comment}"
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(rating.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;
