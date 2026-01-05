const ChatbotButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-40 group">
      <button 
        className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-[0_8px_24px_rgba(34,197,94,0.5)] hover:shadow-[0_12px_32px_rgba(34,197,94,0.7)] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 ring-4 ring-white/30 overflow-hidden"
        onClick={() => alert('Chatbot nya lagi dibuat ojan.')}
      >
        <img src="/ci irma.jpg" alt="Ci Irma" className="h-20 w-20 object-cover rounded-full" />
      </button>
      <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Ngobrol sama Ci Irma
      </div>
    </div>
  );
};

export default ChatbotButton;
