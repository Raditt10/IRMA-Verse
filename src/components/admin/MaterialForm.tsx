import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MaterialFormProps {
  material?: any;
  onSuccess: () => void;
}

export const MaterialForm = ({ material, onSuccess }: MaterialFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      content: formData.get("content") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      pemateri: formData.get("pemateri") as string,
    };

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (material) {
        const { error } = await supabase
          .from("materi_kajian")
          .update(data)
          .eq("id", material.id);

        if (error) throw error;
        toast({ title: "Materi berhasil diupdate" });
      } else {
        const { error } = await supabase
          .from("materi_kajian")
          .insert([{ ...data, created_by: session.session?.user.id }]);

        if (error) throw error;
        toast({ title: "Materi berhasil ditambahkan" });
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
        <CardTitle>{material ? "Edit" : "Tambah"} Materi</CardTitle>
        <CardDescription>
          {material ? "Edit materi kajian" : "Tambah materi kajian baru"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              name="title"
              defaultValue={material?.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="summary">Ringkasan</Label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={material?.summary}
              required
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="content">Konten Lengkap</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={material?.content}
              rows={6}
            />
          </div>
          <div>
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={material?.date ? new Date(material.date).toISOString().split('T')[0] : ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="pemateri">Pemateri</Label>
            <Input
              id="pemateri"
              name="pemateri"
              defaultValue={material?.pemateri}
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
