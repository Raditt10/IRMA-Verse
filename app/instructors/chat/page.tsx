"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import {
	Circle,
	MoreHorizontal,
	Paperclip,
	Phone,
	Search,
	Send,
	ShieldCheck,
	Sparkles,
	Video,
} from "lucide-react";

type Instructor = {
	id: string;
	name: string;
	role: string;
	avatar: string;
	status: "online" | "away" | "offline";
	expertise: string;
};

type ChatMessage = {
	id: string;
	sender: "user" | "instructor";
	content: string;
	time: string;
	status?: "sent" | "read";
};

type ChatThread = {
	instructor: Instructor;
	messages: ChatMessage[];
	lastMessage: string;
	unread: number;
};

const STATUS_COLORS: Record<Instructor["status"], string> = {
	online: "bg-emerald-500",
	away: "bg-amber-500",
	offline: "bg-slate-400",
};

const createInitialThreads = (): ChatThread[] => [
	{
		instructor: {
			id: "ustadz-1",
			name: "Ustadz Ahmad Zaki",
			role: "Fiqih & Bimbingan Ibadah",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
			status: "online",
			expertise: "Fiqih, Akhlak, Pembinaan Harian",
		},
		lastMessage: "Baik, saya kirimkan referensinya dalam format PDF.",
		unread: 0,
		messages: [
			{
				id: "m-1",
				sender: "instructor",
				content: "Assalamualaikum, bagaimana progres hafalan pekan ini?",
				time: "09:12",
				status: "read",
			},
			{
				id: "m-2",
				sender: "user",
				content: "Waalaikumsalam, alhamdulillah sudah 3 halaman. Ada pertanyaan fiqih wudhu.",
				time: "09:15",
				status: "read",
			},
			{
				id: "m-3",
				sender: "instructor",
				content: "Baik, saya kirimkan referensinya dalam format PDF.",
				time: "09:17",
				status: "read",
			},
		],
	},
	{
		instructor: {
			id: "ustadzah-2",
			name: "Ustadzah Fatimah",
			role: "Konsultasi Fiqih Wanita",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatimah",
			status: "away",
			expertise: "Fiqih wanita, adab keluarga, kajian tematik",
		},
		lastMessage: "InsyaAllah kita jadwalkan pekan depan, Senin sore ya.",
		unread: 3,
		messages: [
			{
				id: "m-4",
				sender: "user",
				content: "Ustadzah, saya ingin jadwalkan sesi konsultasi keluarga.",
				time: "20:08",
				status: "sent",
			},
			{
				id: "m-5",
				sender: "instructor",
				content: "InsyaAllah kita jadwalkan pekan depan, Senin sore ya.",
				time: "20:12",
				status: "sent",
			},
		],
	},
	{
		instructor: {
			id: "ustadz-3",
			name: "Ustadz Muhammad Rizki",
			role: "Tafsir & Tahfidz",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizki",
			status: "offline",
			expertise: "Tafsir, tahfidz, sanad bacaan",
		},
		lastMessage: "Jangan lupa murajaah surat sebelumnya sebelum setoran.",
		unread: 0,
		messages: [
			{
				id: "m-6",
				sender: "instructor",
				content: "Jangan lupa murajaah surat sebelumnya sebelum setoran.",
				time: "18:40",
				status: "sent",
			},
		],
	},
];

const ChatPage = () => {
	const [threads, setThreads] = useState<ChatThread[]>([]);
	const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [messageDraft, setMessageDraft] = useState("");
	const messagesRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const initialThreads = createInitialThreads();
		setThreads(initialThreads);

		const requestedId = searchParams.get("instructorId");
		const matched = requestedId
			? initialThreads.find((thread) => thread.instructor.id === requestedId)?.instructor.id
			: null;
		setSelectedInstructorId(matched ?? initialThreads[0]?.instructor.id ?? null);
	}, [searchParams]);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [selectedInstructorId, threads]);

	const filteredThreads = useMemo(() => {
		if (!searchTerm.trim()) return threads;
		return threads.filter((thread) =>
			thread.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			thread.instructor.role.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [threads, searchTerm]);

	const selectedThread = useMemo(
		() => threads.find((thread) => thread.instructor.id === selectedInstructorId) ?? null,
		[threads, selectedInstructorId]
	);

	const handleSendMessage = () => {
		const content = messageDraft.trim();
		if (!content || !selectedThread) return;

		const newMessage: ChatMessage = {
			id: `msg-${Date.now()}`,
			sender: "user",
			content,
			time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
			status: "sent",
		};

		setThreads((prev) =>
			prev.map((thread) =>
				thread.instructor.id === selectedThread.instructor.id
					? {
							...thread,
							messages: [...thread.messages, newMessage],
							lastMessage: content,
							unread: 0,
						}
					: thread
			)
		);

		setMessageDraft("");
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-subtle">
			<DashboardHeader />
			<div className="flex flex-col lg:flex-row">
				<Sidebar />
				<main className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-10">
					<div className="max-w-7xl mx-auto space-y-6">
						<section className="rounded-2xl bg-gradient-primary p-5 sm:p-6 text-white shadow-glow">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/80">
										<Sparkles className="h-4 w-4" />
										Chat Instruktur
									</p>
									<h1 className="text-2xl sm:text-3xl font-semibold mt-1 leading-snug">Sesi bimbingan yang rapi dan profesional</h1>
									<p className="text-white/80 text-sm sm:text-base mt-1">
										Jaga komunikasi terarah, bagikan progres, dan jadwalkan sesi privat langsung bersama instruktur pilihan.
									</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
										<p className="text-lg font-bold">2 sedang online</p>
									</div>
								</div>
							</div>
						</section>

						<section className="grid gap-6 lg:grid-cols-[360px,1fr]">
							<aside className="rounded-2xl border bg-white/80 p-4 shadow-md backdrop-blur">
								<div className="flex items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow-sm">
									<Search className="h-4 w-4 text-slate-500" />
									<Input
										placeholder="Cari instruktur atau keahlian"
										value={searchTerm}
										onChange={(event) => setSearchTerm(event.target.value)}
										className="border-0 shadow-none px-0 text-sm focus-visible:ring-0"
									/>
								</div>

								<div className="mt-4 space-y-3">
									{filteredThreads.map((thread) => {
										const { instructor } = thread;
										const isActive = instructor.id === selectedInstructorId;
										return (
											<button
												key={instructor.id}
												onClick={() => setSelectedInstructorId(instructor.id)}
												className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-150 hover:border-emerald-200 hover:shadow-sm ${
													isActive ? "border-emerald-500/60 bg-emerald-50 shadow-sm" : "bg-white"
												}`}
											>
												<div className="flex items-start gap-3">
													<div className="relative">
														<Avatar className="h-11 w-11 border border-white shadow-sm">
															<AvatarImage src={instructor.avatar} alt={instructor.name} />
															<AvatarFallback>{instructor.name.slice(0, 2)}</AvatarFallback>
														</Avatar>
														<span
															className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border border-white ${STATUS_COLORS[instructor.status]}`}
														/>
													</div>
													<div className="flex-1">
														<div className="flex items-center justify-between gap-2">
															<p className="text-sm font-semibold text-slate-900">{instructor.name}</p>
															{thread.unread > 0 && (
																<span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-white">
																	{thread.unread}
																</span>
															)}
														</div>
														<p className="text-xs text-emerald-700 font-medium">{instructor.role}</p>
														<p className="line-clamp-1 text-xs text-slate-500 mt-1">{thread.lastMessage}</p>
													</div>
												</div>
											</button>
										);
									})}
								</div>
							</aside>

							<div className="rounded-2xl border bg-white/90 shadow-lg backdrop-blur flex flex-col min-h-[60vh]">
								{selectedThread ? (
									<>
										<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b px-4 sm:px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="relative">
													<Avatar className="h-12 w-12 border border-white shadow-sm">
														<AvatarImage src={selectedThread.instructor.avatar} alt={selectedThread.instructor.name} />
														<AvatarFallback>{selectedThread.instructor.name.slice(0, 2)}</AvatarFallback>
													</Avatar>
													<span
														className={`absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border border-white ${STATUS_COLORS[selectedThread.instructor.status]}`}
													/>
												</div>
												<div>
													<div className="flex items-center gap-2">
														<p className="font-semibold text-slate-900">{selectedThread.instructor.name}</p>
														<ShieldCheck className="h-4 w-4 text-emerald-500" />
													</div>
													<p className="text-sm text-slate-500">{selectedThread.instructor.expertise}</p>
												</div>
											</div>
											<div className="flex flex-wrap items-center gap-2">
												<Button variant="outline" size="sm" className="gap-2">
													<Phone className="h-4 w-4" />
													Telepon
												</Button>
												<Button variant="outline" size="sm" className="gap-2">
													<Video className="h-4 w-4" />
													Jadwal Sesi
												</Button>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</div>
										</div>

										<div
											ref={messagesRef}
											className="flex-1 space-y-4 overflow-y-auto px-4 sm:px-6 py-4 bg-gradient-to-b from-slate-50 to-white"
										>
											{selectedThread.messages.map((message) => {
												const isUser = message.sender === "user";
												return (
													<div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
														<div
															className={`max-w-[86%] sm:max-w-xl rounded-2xl px-4 py-3 text-sm shadow-sm transition ${
																isUser
																	? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
																	: "bg-white border text-slate-800"
															}`}
														>
															<p className="whitespace-pre-line leading-relaxed">{message.content}</p>
															<div className={`mt-2 flex items-center gap-2 text-[11px] ${isUser ? "text-white/80" : "text-slate-500"}`}>
																<span>{message.time}</span>
																{isUser && message.status === "read" && (
																	<span className="flex items-center gap-1">
																		<Circle className="h-3 w-3 fill-white/70 text-white/70" />
																		Dibaca
																	</span>
																)}
															</div>
														</div>
													</div>
												);
											})}
										</div>

										<div className="border-t px-4 py-4">
											<div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
												<Button variant="ghost" size="icon" className="text-slate-500">
													<Paperclip className="h-4 w-4" />
												</Button>
												<Textarea
													placeholder="Tulis pesan, tekan Enter untuk kirim"
													value={messageDraft}
													onChange={(event) => setMessageDraft(event.target.value)}
													onKeyDown={handleKeyDown}
													className="min-h-12 w-full flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
												/>
												<Button onClick={handleSendMessage} className="gap-2 px-4 w-full sm:w-auto">
													<Send className="h-4 w-4" />
													Kirim
												</Button>
											</div>
										</div>
									</>
								) : (
									<div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
										<div className="rounded-2xl bg-slate-50 px-6 py-8 shadow-inner">
											<p className="text-sm font-semibold text-emerald-600">Chat Instruktur</p>
											<h2 className="mt-2 text-2xl font-semibold text-slate-900">Pilih instruktur untuk memulai obrolan</h2>
											<p className="mt-1 text-sm text-slate-500">
												Kelola percakapan, kirim progres, dan jadwalkan sesi bimbingan langsung.
											</p>
										</div>
									</div>
								)}
							</div>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
};

export default ChatPage;