"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Star, ThumbsUp, User } from "lucide-react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import ChatbotButton from "@/components/ui/ChatbotButton";
import { Input } from "@/components/ui/input";

type AttendanceForm = {
	session: string;
	date: string;
	time: string;
	location: string;
	status: "hadir" | "tidak";
	notes: string;
	reason?: string;
	instructorArrival: string;
	startTime: string;
	endTime: string;
};

type SurveyForm = {
	rating: number;
	clarity: "yes" | "no";
	relevance: "yes" | "no";
	feedback: string;
};

const Absensi = () => {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [attendance, setAttendance] = useState<AttendanceForm>({
		session: "Kedudukan Akal dan Wahyu",
		date: "2024-12-15",
		time: "13:00 - 15:00",
		location: "Aula Utama",
		status: "hadir",
		notes: "",
		reason: "",
		instructorArrival: "12:45",
		startTime: "13:00",
		endTime: "15:00",
	});

	const [survey, setSurvey] = useState<SurveyForm>({
		rating: 4,
		clarity: "yes",
		relevance: "yes",
		feedback: "",
	});

	useEffect(() => {
		setUser({
			id: "user-123",
			full_name: "Rafaditya Syahputra",
			email: "rafaditya@irmaverse.local",
			avatar: "RS",
		});
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		setTimeout(() => {
			setIsSubmitting(false);
			console.log("Absensi terkirim - data saved");
			alert("Absensi terkirim! Terima kasih, absensi dan angket sudah dicatat.");
			router.push("/dashboard");
		}, 600);
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<p className="text-slate-500">Memuat...</p>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
			style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive" }}
		>
			<DashboardHeader />
			<div className="flex">
				<Sidebar />

				<div className="flex-1 px-6 lg:px-8 py-12">
					<div className="max-w-6xl mx-auto space-y-8">
						<div className="flex items-center justify-between flex-wrap gap-4">
							<div>
								<h1 className="text-4xl font-black text-slate-800">Absensi Kajian</h1>
								<p className="text-slate-600 text-lg">Isi kehadiran dan angket kajian minggu ini</p>
							</div>
							<button
								onClick={() => router.push("/materials")}
								className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-sm hover:bg-slate-50"
							>
								Kembali ke kajian
							</button>
						</div>

						<form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Absensi */}
							<div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
								<div className="flex items-center gap-3">
									<Calendar className="h-5 w-5 text-emerald-600" />
									<h2 className="text-xl font-bold text-slate-900">Form Absensi</h2>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">Kajian</label>
										<Input
											value={attendance.session}
											onChange={(e) => setAttendance({ ...attendance, session: e.target.value })}
											className="bg-slate-50"
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
												<Calendar className="h-4 w-4 text-slate-600" /> Tanggal
											</label>
											<Input
												type="date"
												value={attendance.date}
												onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
												className="bg-slate-50"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
												<Clock className="h-4 w-4 text-slate-600" /> Waktu
											</label>
											<Input
												value={attendance.time}
												onChange={(e) => setAttendance({ ...attendance, time: e.target.value })}
												className="bg-slate-50"
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="space-y-2">
											<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
												<User className="h-4 w-4 text-slate-600" /> Instruktur datang
											</label>
											<Input
												type="time"
												value={attendance.instructorArrival}
												onChange={(e) => setAttendance({ ...attendance, instructorArrival: e.target.value })}
												className="bg-slate-50"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
												<Clock className="h-4 w-4 text-slate-600" /> Kajian dimulai
											</label>
											<Input
												type="time"
												value={attendance.startTime}
												onChange={(e) => setAttendance({ ...attendance, startTime: e.target.value })}
												className="bg-slate-50"
											/>
										</div>
										<div className="space-y-2">
											<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
												<Clock className="h-4 w-4 text-slate-600" /> Kajian selesai
											</label>
											<Input
												type="time"
												value={attendance.endTime}
												onChange={(e) => setAttendance({ ...attendance, endTime: e.target.value })}
												className="bg-slate-50"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
											<MapPin className="h-4 w-4 text-slate-600" /> Lokasi
										</label>
										<Input
											value={attendance.location}
											onChange={(e) => setAttendance({ ...attendance, location: e.target.value })}
											className="bg-slate-50"
										/>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">Status Kehadiran</label>
										<div className="grid grid-cols-2 gap-3">
											{[
												{ value: "hadir", label: "Hadir" },
												{ value: "tidak", label: "Tidak hadir" },
											].map((item) => (
												<button
													key={item.value}
													type="button"
													onClick={() => setAttendance({ ...attendance, status: item.value as "hadir" | "tidak" })}
													className={`rounded-xl border px-4 py-3 font-semibold transition-all ${
														attendance.status === item.value
															? "border-emerald-400 bg-emerald-50 text-emerald-800 shadow-[0_8px_24px_-16px_rgba(16,185,129,0.6)]"
															: "border-slate-200 bg-white text-slate-700 hover:border-emerald-200"
													}`}
												>
													{item.label}
												</button>
											))}
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">Catatan (opsional)</label>
										<textarea
											value={attendance.notes}
											onChange={(e) => setAttendance({ ...attendance, notes: e.target.value })}
											rows={3}
											className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
											placeholder="Tambahkan catatan singkat"
										/>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">Alasan tidak mengikuti kajian (opsional)</label>
										<textarea
											value={attendance.reason ?? ""}
											onChange={(e) => setAttendance({ ...attendance, reason: e.target.value })}
											rows={3}
											className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
											placeholder="Isi jika tidak bisa hadir"
										/>
									</div>
								</div>
							</div>

							{/* Angket */}
							<div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-5">
								<div className="flex items-center gap-3">
									<Star className="h-5 w-5 text-amber-500" />
									<h2 className="text-xl font-bold text-slate-900">Angket Kajian</h2>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">Seberapa puas kamu?</label>
										<div className="flex gap-2">
											{[1, 2, 3, 4, 5].map((score) => (
												<button
													key={score}
													type="button"
													onClick={() => setSurvey({ ...survey, rating: score })}
													className={`h-10 w-10 rounded-full border text-sm font-bold transition-all ${
														survey.rating === score
															? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_8px_24px_-16px_rgba(16,185,129,0.6)]"
															: "border-slate-200 bg-white text-slate-700 hover:border-emerald-200"
													}`}
												>
													{score}
												</button>
											))}
										</div>
									</div>

									<div className="grid grid-cols-1 gap-3">
										{[
											{ key: "clarity", label: "Materi mudah dipahami" },
											{ key: "relevance", label: "Materi relevan dengan kebutuhan" },
										].map((item) => (
											<div
												key={item.key}
												className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
											>
												<span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
													<ThumbsUp className="h-4 w-4 text-slate-600" /> {item.label}
												</span>
												<div className="flex gap-2">
													{[{ value: "yes", label: "Ya" }, { value: "no", label: "Tidak" }].map((opt) => (
														<button
															key={opt.value}
															type="button"
															onClick={() => setSurvey({ ...survey, [item.key]: opt.value } as SurveyForm)}
															className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
																(survey as any)[item.key] === opt.value
																	? "bg-emerald-500 text-white shadow-[0_8px_24px_-16px_rgba(16,185,129,0.6)]"
																	: "bg-white text-slate-700 border border-slate-200 hover:border-emerald-200"
															}`}
														>
															{opt.label}
														</button>
													))}
												</div>
											</div>
										))}
									</div>

									<div className="space-y-2">
										<label className="text-sm font-semibold text-slate-700">Saran atau kesan</label>
										<textarea
											value={survey.feedback}
											onChange={(e) => setSurvey({ ...survey, feedback: e.target.value })}
											rows={4}
											className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
											placeholder="Tulis masukan untuk panitia/pemateri"
										/>
									</div>
								</div>
							</div>

							{/* Submit */}
							<div className="lg:col-span-2">
								<div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
									<div>
										<p className="text-base font-semibold text-slate-900">Kirim absensi dan angket</p>
										<p className="text-sm text-slate-600">Pastikan data sudah benar sebelum dikirim.</p>
									</div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-60"
									>
										{isSubmitting ? "Mengirim..." : "Kirim sekarang"}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<ChatbotButton />
		</div>
	);
};

export default Absensi;