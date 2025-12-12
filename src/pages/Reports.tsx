import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

const Reports = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExport = async (type: 'absensi' | 'quiz', format: 'excel' | 'pdf') => {
    setLoading(`${type}-${format}`);
    
    try {
      const result = format === 'excel' 
        ? await exportToExcel(type)
        : await exportToPDF(type);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: `Laporan ${type} berhasil di-export ke ${format.toUpperCase()}`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Export Laporan
            </h1>
          </div>
          <p className="text-muted-foreground">
            Download laporan absensi dan hasil quiz dalam format Excel atau PDF
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
                Laporan Absensi
              </CardTitle>
              <CardDescription>
                Export data absensi kajian ke Excel atau PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleExport('absensi', 'excel')}
                disabled={loading === 'absensi-excel'}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {loading === 'absensi-excel' ? 'Exporting...' : 'Export ke Excel'}
              </Button>
              <Button
                onClick={() => handleExport('absensi', 'pdf')}
                disabled={loading === 'absensi-pdf'}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {loading === 'absensi-pdf' ? 'Exporting...' : 'Export ke PDF'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Laporan Quiz
              </CardTitle>
              <CardDescription>
                Export hasil quiz dan skor member ke Excel atau PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleExport('quiz', 'excel')}
                disabled={loading === 'quiz-excel'}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {loading === 'quiz-excel' ? 'Exporting...' : 'Export ke Excel'}
              </Button>
              <Button
                onClick={() => handleExport('quiz', 'pdf')}
                disabled={loading === 'quiz-pdf'}
                className="w-full"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                {loading === 'quiz-pdf' ? 'Exporting...' : 'Export ke PDF'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
