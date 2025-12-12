import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface AchievementFormProps {
  achievement?: any;
  onSuccess: () => void;
}

export const AchievementForm = ({ achievement, onSuccess }: AchievementFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(achievement?.image_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("prestasi-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("prestasi-images")
        .getPublicUrl(fileName);

      setImageUrl(publicUrl);
      
      toast({
        title: "Berhasil",
        description: "Gambar berhasil diupload",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      category: formData.get("category") as string,
      image_url: imageUrl,
    };

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (achievement) {
        const { error } = await supabase
          .from("prestasi")
          .update(data)
          .eq("id", achievement.id);

        if (error) throw error;
        toast({ title: "Prestasi berhasil diupdate" });
      } else {
        const { error } = await supabase
          .from("prestasi")
          .insert([{ ...data, created_by: session.session?.user.id }]);

        if (error) throw error;
        toast({ title: "Prestasi berhasil ditambahkan" });
      }

      onSuccess();
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{achievement ? "Edit" : "Tambah"} Prestasi</CardTitle>
        <CardDescription>
          {achievement ? "Edit prestasi" : "Tambah prestasi baru"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              name="title"
              defaultValue={achievement?.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={achievement?.description}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={achievement?.date ? new Date(achievement.date).toISOString().split('T')[0] : ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              name="category"
              defaultValue={achievement?.category}
              placeholder="Lomba, Penghargaan, dll"
            />
          </div>
          <div className="space-y-2">
            <Label>Gambar Prestasi</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Mengupload..." : "Upload Gambar"}
            </Button>
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="mt-2 max-h-48 rounded-lg" />
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
