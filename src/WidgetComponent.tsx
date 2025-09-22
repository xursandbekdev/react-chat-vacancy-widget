import React, { useState, useRef, useEffect } from "react";
import {
    Briefcase,
    DollarSign,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Send,
} from "lucide-react";
import { Message, Vacancy, APIResponse, UploadResponse, WidgetProps } from "./types";
import "./styles.css";

const WidgetComponent: React.FC<WidgetProps> = ({
    token,
    theme = "#2563eb",
    siteName = "Kompaniya",
    enableLogging = false,
    position = "bottom-right",
    width = "370px",
    height = "500px",
    onReady,
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [sessionId] = useState<string>(
        () =>
            "session_" +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
    );
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isLoadingVacancies, setIsLoadingVacancies] = useState<boolean>(true);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [uploadedResume, setUploadedResume] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [downloadFileName, setDownloadFileName] = useState<string | null>(null);
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    const chatApiUrl = `https://chatai.my-blog.uz/webhook/${token}`;
    const uploadApiUrl = `${import.meta.url}/upload/`;
    const vacancyApiUrl = `${import.meta.url}/vakansiya/`;
    const downloadBaseUrl = `${import.meta.url}/download/`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedVacancy, downloadFileName]);

    useEffect(() => {
        loadVacancies();
        if (onReady) onReady();
    }, []);

    const loadVacancies = async () => {
        setIsLoadingVacancies(true);
        try {
            const response = await fetch(vacancyApiUrl, {
                method: "GET",
                headers: { accept: "application/json" },
            });

            if (response.ok) {
                const data: Vacancy[] = await response.json();
                setVacancies(
                    data && data.length
                        ? data
                        : [
                            {
                                id: 1,
                                title: "Frontend Developer",
                                description:
                                    "React, TypeScript, Tailwind CSS bilan ishlash tajribasi kerak. Zamonaviy web ilovalarni yaratish.",
                                price: "$1000-1500",
                            },
                            {
                                id: 2,
                                title: "Backend Developer",
                                description: "Node.js, Express, MongoDB bilan ishlash.",
                                price: "$1200-1800",
                            },
                        ]
                );
            } else {
                setVacancies([
                    {
                        id: 1,
                        title: "Frontend Developer",
                        description: "React, TypeScript bilan ishlash tajribasi kerak.",
                        price: "$1000-1500",
                    },
                ]);
            }
        } catch (error) {
            if (enableLogging) console.error(error);
            setVacancies([
                {
                    id: 1,
                    title: "Frontend Developer",
                    description:
                        "React, TypeScript bilan ishlash tajribasi kerak. Zamonaviy web texnologiyalari.",
                    price: "$1000-1500",
                },
            ]);
        } finally {
            setIsLoadingVacancies(false);
        }
    };

    const addMessage = (
        text: string,
        sender: "user" | "bot" | "system"
    ): void => {
        const newMessage: Message = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            type: sender,
            content: text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const animateTyping = async (text: string): Promise<void> => {
        return new Promise((resolve) => {
            setIsTyping(true);
            let currentText = "";
            let i = 0;

            const interval = setInterval(() => {
                if (i < text.length) {
                    const remainingChars = text.length - i;
                    const charsToAdd =
                        Math.floor(Math.random() * Math.min(4, remainingChars)) + 1;

                    for (let k = 0; k < charsToAdd && i < text.length; k++) {
                        currentText += text.charAt(i);
                        i++;
                    }

                    setMessages((prev) => {
                        const newMessages = [...prev];
                        if (newMessages[newMessages.length - 1]?.type === "bot") {
                            newMessages[newMessages.length - 1].content = currentText;
                        }
                        return newMessages;
                    });
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                    resolve();
                }
            }, 40);
        });
    };

    const sendMessage = async (): Promise<void> => {
        const messageText = inputMessage.trim();
        if (messageText === "" || isLoading) return;

        addMessage(messageText, "user");
        setInputMessage("");
        setIsLoading(true);

        addMessage("", "bot");

        try {
            const requestData = {
                message: messageText,
                session_id: sessionId,
                resume: uploadedResume,
                vakansiya: "",
                description: "",
            };

            const response = await fetch(chatApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok)
                throw new Error("Tarmoq xatosi yoki serverdan xato javob keldi.");

            const data: APIResponse = await response.json();
            const responseText =
                data.answer || data.output || "Javob formati noto'g'ri.";

            if (data.file_name) {
                setDownloadFileName(data.file_name);
                addMessage(`Fayl tayyor: ${data.file_name}`, "system");
            } else {
                await animateTyping(responseText);
            }
        } catch (error) {
            if (enableLogging) console.error("Xatolik:", error);
            await animateTyping(
                "Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCardExpansion = (vacancyId: number) => {
        setExpandedCard(expandedCard === vacancyId ? null : vacancyId);
    };

    const handleApply = (vacancy: Vacancy) => {
        setSelectedVacancy(vacancy);
    };

    const uploadFile = async (file?: File): Promise<void> => {
        const pickedFile = file || fileInputRef.current?.files?.[0];

        if (!pickedFile) {
            alert("Iltimos, avval fayl tanlang!");
            return;
        }

        if (pickedFile.type !== "application/pdf") {
            alert("Faqat PDF fayllarni yuklashingiz mumkin.");
            return;
        }

        if (!selectedVacancy) {
            alert("Iltimos, avval vakansiyani tanlang.");
            return;
        }

        const formData = new FormData();
        formData.append("file", pickedFile);
        formData.append("session_id", sessionId);

        try {
            setIsSubmitting(true);
            addMessage("Resume yuklanmoqda...", "system");

            const response = await fetch(uploadApiUrl, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const res: UploadResponse = await response.json();
                setUploadedResume(res.filename);
                setSelectedVacancy(null);
                await sendApplicationToAPI(true, res.filename);
            } else {
                const errorData: UploadResponse = await response.json();
                addMessage(`Fayl yuklashda xatolik: ${errorData.detail}`, "bot");
            }
        } catch (error) {
            if (enableLogging) console.error("Yuklash xatosi:", error);
            addMessage("Faylni yuklashda xatolik yuz berdi.", "bot");
        } finally {
            setIsSubmitting(false);
            setSelectedVacancy(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const sendApplicationToAPI = async (
        hasResume: boolean,
        resumeFilename?: string
    ) => {
        if (!selectedVacancy) {
            addMessage("Vakansiya tanlanmagan.", "system");
            return;
        }

        try {
            const message = hasResume ? "Resume yuborildi" : "Resume yaratish";
            addMessage("", "bot");

            const requestData = {
                message: message,
                session_id: sessionId,
                resume: resumeFilename || "",
                vakansiya: selectedVacancy.title,
                description: selectedVacancy.description,
            };

            const response = await fetch(chatApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data: APIResponse = await response.json();
                const responseText = data.answer || data.output || "Ariza yuborildi.";
                setSelectedVacancy(null);

                if (data.file_name) {
                    setDownloadFileName(data.file_name);
                    addMessage(`Fayl tayyor: ${data.file_name}`, "system");
                } else {
                    await animateTyping(responseText);
                }
            } else {
                await animateTyping("Ariza yuborishda xatolik yuz berdi.");
            }
        } catch (error) {
            if (enableLogging) console.error("Ariza yuborish xatosi:", error);
            await animateTyping("Ariza yuborishda xatolik yuz berdi.");
        } finally {
            setSelectedVacancy(null);
        }
    };

    const handleCreateResume = async () => {
        if (!selectedVacancy) return;
        setIsSubmitting(true);
        await sendApplicationToAPI(false);
        setIsSubmitting(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter" && !isLoading) {
            sendMessage();
        }
    };

    const truncateText = (text: string, limit: number) => {
        if (text.length <= limit) return text;
        return text.substring(0, limit) + "...";
    };

    const downloadFile = async (filename: string) => {
        try {
            const url = `${downloadBaseUrl}${encodeURIComponent(filename)}`;
            const res = await fetch(url, { method: "GET" });
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const link = document.createElement("a");
            const href = window.URL.createObjectURL(blob);
            link.href = href;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(href);

            setDownloadFileName(null);
        } catch (err) {
            if (enableLogging) console.error("Download xatolik:", err);
            addMessage("Faylni yuklab olishda xatolik yuz berdi.", "bot");
        }
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => chatInputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    const positionClasses = {
        "bottom-right": "right: 32px; bottom: 8px;",
        "bottom-left": "left: 32px; bottom: 8px;",
        "top-right": "right: 32px; top: 8px;",
        "top-left": "left: 32px; top: 8px;",
    };

    return (
        <>
            <div style={{ position: "fixed", zIndex: 50 }}>
                {!isOpen ? (
                    <button
                        aria-label="Open Chat"
                        onClick={() => setIsOpen(true)}
                        className="shimmer-button"
                        style={{ backgroundColor: theme }}
                        title="Savol bering"
                    >
                        <div className="shimmer"></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative", zIndex: 10 }}>
                            <div className="icon-container" style={{ background: `linear-gradient(to right, ${theme}, #0c00af)` }}>
                                <svg style={{ width: "12px", height: "12px", fill: "white" }} viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span style={{ color: "white" }}>{siteName}</span>
                        </div>
                    </button>
                ) : null}
            </div>

            <div
                style={{
                    position: "fixed",
                    transition: "all 0.3s ease",
                    transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(32px)",
                    opacity: isOpen ? 1 : 0,
                    zIndex: 50,
                    ...Object.fromEntries(Object.entries(positionClasses).find(([key]) => key === position)![1].split(";").map(s => s.split(":").map(s => s.trim())))
                }}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="close-button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>

                <div
                    className="chat-container"
                    style={{ width, height }}
                >
                    <div className="header">
                        <div>
                            <div className="header-title">{siteName}</div>
                            <div className="header-subtitle">kadrlar bo'limi</div>
                        </div>
                    </div>

                    <div className="message-area chat-scroll">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{ display: "flex", justifyContent: message.type === "user" ? "flex-end" : "flex-start" }}
                            >
                                <div className={`message ${message.type}`}>
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {isLoadingVacancies ? (
                                <div style={{ textAlign: "center", padding: "24px", height: "144px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <RefreshCw style={{ width: "24px", height: "24px", animation: "spin 1s linear infinite", color: "#2563eb", marginBottom: "4px" }} />
                                    <p style={{ color: "#666", fontSize: "12px" }}>Yuklanmoqda...</p>
                                </div>
                            ) : vacancies.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "16px" }}>
                                    <Briefcase style={{ width: "20px", height: "20px", color: "#d1d5db", margin: "0 auto 4px" }} />
                                    <p style={{ color: "#6b7280", fontSize: "12px" }}>Vakansiyalar topilmadi</p>
                                </div>
                            ) : (

                                !selectedVacancy &&
                                messages.length <= 0 &&
                                vacancies.map((vacancy) => (
                                    <div key={vacancy.id} className="vacancy-card">
                                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                            <div style={{ flex: 1, paddingRight: "8px" }}>
                                                <h3 className="vacancy-title">{vacancy.title}</h3>
                                                <div className="vacancy-price">
                                                    <DollarSign style={{ width: "12px", height: "12px" }} />
                                                    <span>{vacancy.price}</span>
                                                </div>
                                                <p className="vacancy-description">{truncateText(vacancy.description, 60)}</p>
                                            </div>

                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                                <button
                                                    onClick={() => handleApply(vacancy)}
                                                    className="apply-button"
                                                >
                                                    Apply
                                                </button>
                                                <button
                                                    onClick={() => toggleCardExpansion(vacancy.id)}
                                                    className="expand-button"
                                                    aria-label="expand"
                                                >
                                                    {expandedCard === vacancy.id ? (
                                                        <ChevronUp style={{ width: "16px", height: "16px" }} />
                                                    ) : (
                                                        <ChevronDown style={{ width: "16px", height: "16px" }} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedCard === vacancy.id && (
                                            <div className="vacancy-expanded">
                                                <p style={{ marginBottom: "8px" }}>{vacancy.description}</p>
                                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <button
                                                        onClick={() => handleApply(vacancy)}
                                                        className="apply-button"
                                                    >
                                                        <Send style={{ width: "12px", height: "12px", display: "inline-block", marginRight: "4px" }} />
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {selectedVacancy && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div className="action-card">
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            style={{ display: "none" }}
                                            onChange={onFileChange}
                                        />

                                        <button
                                            onClick={triggerFileInput}
                                            disabled={isSubmitting}
                                            className="action-button upload"
                                        >
                                            Resume yuklash
                                        </button>

                                        <button
                                            onClick={handleCreateResume}
                                            disabled={isSubmitting}
                                            className="action-button create"
                                        >
                                            Resume yaratish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {downloadFileName && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div className="download-card">
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div>
                                            <p className="download-title">Fayl tayyor</p>
                                            <p className="download-filename">{downloadFileName}</p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <button
                                                onClick={() => downloadFile(downloadFileName)}
                                                className="download-button"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="input-area">
                        <div className="input-container">
                            <input
                                ref={chatInputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Savol yozing..."
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                className="chat-input"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className={`send-button ${inputMessage.trim() && !isLoading ? "enabled" : "disabled"}`}
                            >
                                Yuborish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WidgetComponent;