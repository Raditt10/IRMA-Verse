import { supabase } from "@/integrations/supabase/client";

export const exportToExcel = async (type: 'absensi' | 'quiz') => {
  try {
    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    if (type === 'absensi') {
      const { data: absensiData, error } = await supabase
        .from("absensi")
        .select("*, jadwal_kajian(title, date)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(absensiData?.map(a => a.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      headers = ['Nama', 'Kajian', 'Tanggal Kajian', 'Waktu Absen', 'Status', 'Metode'];
      data = absensiData?.map(item => {
        const profile = profileMap.get(item.user_id);
        return [
          profile?.full_name || '-',
          item.jadwal_kajian?.title || '-',
          new Date(item.jadwal_kajian?.date).toLocaleDateString('id-ID'),
          new Date(item.waktu_absen).toLocaleString('id-ID'),
          item.status,
          item.metode || '-'
        ];
      }) || [];
      filename = `Laporan_Absensi_${new Date().toISOString().split('T')[0]}.csv`;

    } else if (type === 'quiz') {
      const { data: quizData, error } = await supabase
        .from("quiz_attempts")
        .select("*, quiz(title)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(quizData?.map(q => q.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      headers = ['Nama', 'Quiz', 'Skor (%)', 'Total Poin', 'Tanggal', 'Waktu Mulai', 'Waktu Selesai'];
      data = quizData?.map(item => {
        const profile = profileMap.get(item.user_id);
        return [
          profile?.full_name || '-',
          item.quiz?.title || '-',
          item.score,
          item.total_points,
          new Date(item.created_at).toLocaleDateString('id-ID'),
          new Date(item.started_at).toLocaleTimeString('id-ID'),
          new Date(item.completed_at).toLocaleTimeString('id-ID')
        ];
      }) || [];
      filename = `Laporan_Quiz_${new Date().toISOString().split('T')[0]}.csv`;
    }

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    return { success: true };
  } catch (error: any) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
};

export const exportToPDF = async (type: 'absensi' | 'quiz') => {
  try {
    // For PDF export, we'll create an HTML version that can be printed
    let data: any[] = [];
    let title = '';

    if (type === 'absensi') {
      const { data: absensiData, error } = await supabase
        .from("absensi")
        .select("*, jadwal_kajian(title, date)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles
      const userIds = [...new Set(absensiData?.map(a => a.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      title = 'Laporan Absensi';
      data = absensiData?.map(item => ({
        ...item,
        profile: profileMap.get(item.user_id)
      })) || [];

    } else if (type === 'quiz') {
      const { data: quizData, error } = await supabase
        .from("quiz_attempts")
        .select("*, quiz(title)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles
      const userIds = [...new Set(quizData?.map(q => q.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      title = 'Laporan Hasil Quiz';
      data = quizData?.map(item => ({
        ...item,
        profile: profileMap.get(item.user_id)
      })) || [];
    }

    // Create printable HTML
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header { margin-bottom: 20px; }
          .date { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p class="date">Tanggal: ${new Date().toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        ${type === 'absensi' ? `
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Kajian</th>
                <th>Tanggal Kajian</th>
                <th>Waktu Absen</th>
                <th>Status</th>
                <th>Metode</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.profile?.full_name || '-'}</td>
                  <td>${item.jadwal_kajian?.title || '-'}</td>
                  <td>${new Date(item.jadwal_kajian?.date).toLocaleDateString('id-ID')}</td>
                  <td>${new Date(item.waktu_absen).toLocaleString('id-ID')}</td>
                  <td>${item.status}</td>
                  <td>${item.metode || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Quiz</th>
                <th>Skor (%)</th>
                <th>Total Poin</th>
                <th>Tanggal</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              ${data.map((item: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.profile?.full_name || '-'}</td>
                  <td>${item.quiz?.title || '-'}</td>
                  <td>${item.score}%</td>
                  <td>${item.total_points}</td>
                  <td>${new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                  <td>${new Date(item.started_at).toLocaleTimeString('id-ID')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    return { success: true };
  } catch (error: any) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
};
