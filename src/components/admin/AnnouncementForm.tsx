import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnnouncementFormProps {
  announcement?: any;
  onSuccess: () => void;
}

export const AnnouncementForm = ({ announcement, onSuccess }: AnnouncementFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      date: new Date().toISOString(),
    };

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (announcement) {
        const { error } = await supabase
          .from("announcements")
          .update(data)
          .eq("id", announcement.id);

        if (error) throw error;
        toast({ title: "Pengumuman berhasil diupdate" });
      } else {
        const { error } = await supabase
          .from("announcements")
          .insert([{ ...data, created_by: session.session?.user.id }]);

        if (error) throw error;
        toast({ title: "Pengumuman berhasil ditambahkan" });
        
        // Create notification for all users
        await supabase.from("notifications").insert([{
          title: "Pengumuman Baru",
          message: data.title,
          type: "announcement",
          user_id: null,
        }]);
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
        <CardTitle>{announcement ? "Edit" : "Tambah"} Pengumuman</CardTitle>
        <CardDescription>
          {announcement ? "Edit pengumuman yang ada" : "Buat pengumuman baru"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              name="title"
              defaultValue={announcement?.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={announcement?.description}
              required
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              name="category"
              defaultValue={announcement?.category}
              placeholder="Kajian, Kepanitiaan, dll"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
