import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  RotateCcw,
  Minimize2,
  Maximize2,
} from "lucide-react";

// DIVINE SYSTEM PROMPT và KNOWLEDGE BASE
const DIVINE_SYSTEM_PROMPT = `Bạn là trợ lý AI của website DIVINE - chuyên cung cấp các tài khoản kỹ thuật số premium chất lượng cao.

THÔNG TIN WEBSITE DIVINE:
- Tên: Divine
- Chuyên nghiệp: Cung cấp tài khoản premium các ứng dụng/dịch vụ kỹ thuật số
- Sản phẩm chính: YouTube Premium, Zoom Pro, Duolingo Plus, CapCut Premium, Game Steam

TÍNH CÁCH & PHONG CÁCH:
- Thân thiện, chuyên nghiệp và đáng tin cậy
- Trả lời bằng tiếng Việt tự nhiên
- Tập trung vào việc hỗ trợ khách hàng mua hàng
- Luôn hướng dẫn cụ thể từng bước
- Sử dụng emoji phù hợp để tạo cảm giác thân thiện 😊

NHIỆM VỤ CHÍNH:
1. Giới thiệu sản phẩm của Divine
2. Hướng dẫn quy trình mua hàng chi tiết
3. Giải đáp thắc mắc về sản phẩm và dịch vụ
4. Hỗ trợ khách hàng trong quá trình thanh toán
5. Tư vấn sản phẩm phù hợp với nhu cầu

QUY TRÌNH MUA HÀNG CHUẨN (LUÔN NHỚ):
1. Chọn sản phẩm muốn mua trên website
2. Thêm vào giỏ hàng
3. Trong giỏ hàng: NHẬP EMAIL nhận tài khoản (rất quan trọng!)
4. Nhấn "Thanh toán bằng QR"
5. Quét mã QR để thanh toán
6. Đợi hệ thống xử lý
7. Nhận tài khoản qua email đã nhập

NGUYÊN TẮC TRẢ LỜI:
- Luôn hướng dẫn từng bước cụ thể
- Nhấn mạnh việc nhập email chính xác
- Giải thích lợi ích của từng sản phẩm
- Trả lời ngắn gọn, dễ hiểu
- Tạo niềm tin với khách hàng`;

const DIVINE_KNOWLEDGE_BASE = {
  products: {
    "youtube premium": {
      name: "YouTube Premium",
      benefits: [
        "Xem video không quảng cáo",
        "Nghe nhạc nền khi tắt màn hình",
        "Tải video offline",
        "Truy cập YouTube Music Premium",
      ],
      price: "Liên hệ để biết giá",
      duration: "Thời gian sử dụng dài hạn",
    },
    zoom: {
      name: "Zoom Pro",
      benefits: [
        "Họp không giới hạn thời gian",
        "Lưu trữ đám mây",
        "Quản lý cuộc họp nâng cao",
        "Hỗ trợ nhiều người tham gia",
      ],
      price: "Liên hệ để biết giá",
      duration: "Theo gói đăng ký",
    },
    duolingo: {
      name: "Duolingo Plus",
      benefits: [
        "Học không quảng cáo",
        "Tải bài học offline",
        "Trái tim không giới hạn",
        "Theo dõi tiến độ chi tiết",
      ],
      price: "Liên hệ để biết giá",
      duration: "Theo gói đăng ký",
    },
    capcut: {
      name: "CapCut Premium",
      benefits: [
        "Xuất video không watermark",
        "Thư viện template premium",
        "Hiệu ứng và filter cao cấp",
        "Lưu trữ đám mây",
      ],
      price: "Liên hệ để biết giá",
      duration: "Theo gói đăng ký",
    },
    steam: {
      name: "Game Steam",
      benefits: [
        "Thư viện game đa dạng",
        "Giá ưu đãi đặc biệt",
        "Game bản quyền chính hãng",
        "Update tự động",
      ],
      price: "Tùy theo game cụ thể",
      duration: "Sở hữu vĩnh viễn",
    },
  },

  faq: [
    {
      keywords: ["cách mua", "mua hàng", "quy trình"],
      answer: `Quy trình mua hàng trên Divine rất đơn giản:

🛒 **Bước 1**: Chọn sản phẩm bạn muốn mua
🛍️ **Bước 2**: Thêm vào giỏ hàng  
📧 **Bước 3**: Nhập email nhận tài khoản (quan trọng!)
💳 **Bước 4**: Nhấn "Thanh toán bằng QR"
📱 **Bước 5**: Quét mã QR để thanh toán
⏳ **Bước 6**: Đợi hệ thống xử lý
✅ **Bước 7**: Nhận tài khoản qua email

Có cần mình hướng dẫn chi tiết bước nào không? 😊`,
    },
    {
      keywords: ["email", "nhập email", "địa chỉ email"],
      answer: `📧 **Về việc nhập email:**

- Email này sẽ được dùng để gửi thông tin tài khoản cho bạn
- Hãy đảm bảo nhập chính xác và kiểm tra lại
- Nên dùng email thường xuyên check để không bỏ lỡ
- Sau khi thanh toán, hệ thống sẽ tự động gửi tài khoản về email này

**Lưu ý**: Nếu nhập sai email, bạn sẽ không nhận được tài khoản nhé! 🚨`,
    },
    {
      keywords: ["thanh toán", "qr", "payment"],
      answer: `💳 **Về thanh toán QR:**

- Nhấn nút "Thanh toán bằng QR" 
- Hệ thống sẽ hiển thị mã QR
- Dùng app ngân hàng quét mã QR
- Thanh toán theo số tiền hiển thị
- Sau khi thanh toán thành công, đợi hệ thống xử lý

⏰ Thời gian xử lý: Thường trong vòng 5-15 phút
📧 Tài khoản sẽ được gửi về email bạn đã nhập`,
    },
    {
      keywords: ["bao lâu", "thời gian", "khi nào có"],
      answer: `⏰ **Thời gian nhận tài khoản:**

- Sau khi thanh toán thành công: 5-15 phút
- Hệ thống tự động xử lý 24/7
- Nếu quá 30 phút chưa nhận được, hãy liên hệ support
- Kiểm tra cả hộp thư spam/junk mail

📧 Tài khoản sẽ được gửi kèm hướng dẫn sử dụng chi tiết!`,
    },
    {
      keywords: ["giá", "bao nhiều tiền", "cost"],
      answer: `💰 **Về giá sản phẩm:**

Giá các sản phẩm trên Divine rất cạnh tranh và ưu đãi!
- Giá cụ thể sẽ hiển thị khi bạn chọn sản phẩm
- Chúng tôi luôn cập nhật giá tốt nhất thị trường
- Có các chương trình khuyến mãi định kỳ

💡 **Tip**: Thêm vào giỏ hàng để xem giá chính xác nhất! 😊`,
    },
  ],
};

// Hàm tìm kiếm trong knowledge base
const searchDivineKnowledge = (userInput) => {
  const input = userInput.toLowerCase();

  // Tìm sản phẩm cụ thể
  for (let [key, product] of Object.entries(DIVINE_KNOWLEDGE_BASE.products)) {
    if (input.includes(key) || input.includes(product.name.toLowerCase())) {
      return `🌟 **${product.name}**

✨ **Lợi ích:**
${product.benefits.map((benefit) => `• ${benefit}`).join("\n")}

💰 **Giá**: ${product.price}
⏰ **Thời gian**: ${product.duration}

Bạn muốn mua ${product.name} không? Mình sẽ hướng dẫn cách mua nhé! 😊`;
    }
  }

  // Tìm trong FAQ
  for (let faq of DIVINE_KNOWLEDGE_BASE.faq) {
    if (faq.keywords.some((keyword) => input.includes(keyword))) {
      return faq.answer;
    }
  }

  // Kiểm tra greeting
  if (
    input.includes("xin chào") ||
    input.includes("hello") ||
    input.includes("hi") ||
    input.includes("chào")
  ) {
    return `👋 Xin chào! Mình là trợ lý AI của Divine - chuyên cung cấp tài khoản premium chất lượng cao!

🎯 **Divine có những sản phẩm sau:**
• YouTube Premium - Xem video không quảng cáo
• Zoom Pro - Họp không giới hạn thời gian  
• Duolingo Plus - Học ngôn ngữ premium
• CapCut Premium - Chỉnh sửa video chuyên nghiệp
• Game Steam - Thư viện game bản quyền

💬 Bạn quan tâm sản phẩm nào hoặc cần hướng dẫn mua hàng không? Cứ hỏi mình nhé! 😊`;
  }

  return null;
};

const GroqChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // API configuration
  const API_KEY = "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";
  const MODEL = "llama3-8b-8192";
  const BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

  // Custom CSS styles
  const styles = {
    chatContainer: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1050,
    },
    chatButton: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#6366f1",
      border: "none",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
      transition: "all 0.3s ease",
    },
    chatWindow: {
      width: "380px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      border: "1px solid #e5e7eb",
      transition: "all 0.3s ease",
    },
    chatWindowMinimized: {
      height: "60px",
      overflow: "hidden",
    },
    chatWindowFull: {
      height: "480px",
    },
    header: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "white",
      padding: "16px 20px",
      borderTopLeftRadius: "16px",
      borderTopRightRadius: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    headerButtons: {
      display: "flex",
      gap: "8px",
    },
    headerButton: {
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "6px",
      borderRadius: "6px",
      transition: "background-color 0.2s",
    },
    messagesContainer: {
      height: "340px",
      overflowY: "auto",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    messageWrapper: {
      display: "flex",
    },
    messageWrapperUser: {
      justifyContent: "flex-end",
    },
    messageWrapperBot: {
      justifyContent: "flex-start",
    },
    messageBubble: {
      maxWidth: "280px",
      padding: "12px 16px",
      borderRadius: "18px",
      fontSize: "14px",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    },
    messageBubbleUser: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "white",
    },
    messageBubbleBot: {
      backgroundColor: "#f8fafc",
      color: "#334155",
      border: "1px solid #e2e8f0",
    },
    messageTime: {
      fontSize: "11px",
      marginTop: "6px",
      opacity: 0.7,
    },
    emptyState: {
      textAlign: "center",
      color: "#64748b",
      padding: "60px 20px",
      fontSize: "14px",
    },
    inputContainer: {
      padding: "20px",
      borderTop: "1px solid #e5e7eb",
      backgroundColor: "#fafafa",
      borderBottomLeftRadius: "16px",
      borderBottomRightRadius: "16px",
    },
    inputGroup: {
      display: "flex",
      gap: "10px",
      alignItems: "flex-end",
    },
    textInput: {
      flex: 1,
      resize: "none",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      padding: "12px 16px",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      backgroundColor: "white",
    },
    textInputFocus: {
      borderColor: "#6366f1",
      boxShadow: "0 0 0 3px rgba(99,102,241,0.1)",
    },
    sendButton: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      border: "none",
      color: "white",
      borderRadius: "12px",
      padding: "12px 16px",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sendButtonDisabled: {
      background: "#9ca3af",
      cursor: "not-allowed",
      transform: "none",
    },
    loadingDots: {
      display: "flex",
      gap: "3px",
    },
    dot: {
      width: "6px",
      height: "6px",
      backgroundColor: "#6366f1",
      borderRadius: "50%",
      animation: "bounce 1.4s infinite ease-in-out",
    },
  };

  // Add CSS animation for loading dots
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      .dot:nth-child(1) { animation-delay: -0.32s; }
      .dot:nth-child(2) { animation-delay: -0.16s; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      role: "assistant",
      content: `👋 Xin chào! Mình là trợ lý AI của Divine - chuyên cung cấp tài khoản premium chất lượng cao!

🎯 **Divine có những sản phẩm sau:**
• YouTube Premium - Xem video không quảng cáo
• Zoom Pro - Họp không giới hạn thời gian  
• Duolingo Plus - Học ngôn ngữ premium
• CapCut Premium - Chỉnh sửa video chuyên nghiệp
• Game Steam - Thư viện game bản quyền

💬 Bạn quan tâm sản phẩm nào hoặc cần hướng dẫn mua hàng không? Cứ hỏi mình nhé! 😊`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Generate response from Groq API với tích hợp knowledge base
  const generateResponse = async (userInput) => {
    // Kiểm tra knowledge base trước
    const knowledgeResult = searchDivineKnowledge(userInput);
    if (knowledgeResult) {
      return knowledgeResult;
    }

    // Nếu không tìm thấy trong knowledge base, gọi API
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    };

    const apiMessages = [{ role: "system", content: DIVINE_SYSTEM_PROMPT }];

    const recentMessages = messages.slice(-8);
    recentMessages.forEach((msg) => {
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    apiMessages.push({ role: "user", content: userInput });

    const data = {
      model: MODEL,
      messages: apiMessages,
      max_tokens: 800,
      temperature: 0.7,
    };

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error("API Error:", error);
      return "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại hoặc liên hệ support của Divine để được hỗ trợ tốt nhất! 😊";
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(userMessage.content);
      const botMessage = {
        role: "assistant",
        content: botResponse,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ support Divine! 😊",
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat history
  const clearHistory = () => {
    const welcomeMessage = {
      role: "assistant",
      content: `👋 Xin chào! Mình là trợ lý AI của Divine - chuyên cung cấp tài khoản premium chất lượng cao!

🎯 **Divine có những sản phẩm sau:**
• YouTube Premium - Xem video không quảng cáo
• Zoom Pro - Họp không giới hạn thời gian  
• Duolingo Plus - Học ngôn ngữ premium
• CapCut Premium - Chỉnh sửa video chuyên nghiệp
• Game Steam - Thư viện game bản quyền

💬 Bạn quan tâm sản phẩm nào hoặc cần hướng dẫn mua hàng không? Cứ hỏi mình nhé! 😊`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div style={styles.chatContainer}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          style={styles.chatButton}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            ...styles.chatWindow,
            ...(isMinimized
              ? styles.chatWindowMinimized
              : styles.chatWindowFull),
          }}
        >
          {/* Header */}
          <div style={styles.header}>
            <h6 style={styles.headerTitle}>🌟 Divine AI Assistant</h6>
            <div style={styles.headerButtons}>
              <button
                style={styles.headerButton}
                onClick={() => setIsMinimized(!isMinimized)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
              >
                {isMinimized ? (
                  <Maximize2 size={16} />
                ) : (
                  <Minimize2 size={16} />
                )}
              </button>
              <button
                style={styles.headerButton}
                onClick={clearHistory}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw size={16} />
              </button>
              <button
                style={styles.headerButton}
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
                title="Đóng"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div style={styles.messagesContainer}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.messageWrapper,
                      ...(message.role === "user"
                        ? styles.messageWrapperUser
                        : styles.messageWrapperBot),
                    }}
                  >
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...(message.role === "user"
                          ? styles.messageBubbleUser
                          : styles.messageBubbleBot),
                      }}
                    >
                      <div>{message.content}</div>
                      {message.timestamp && (
                        <div style={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={styles.messageWrapperBot}>
                    <div
                      style={{
                        ...styles.messageBubble,
                        ...styles.messageBubbleBot,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span>Divine đang suy nghĩ</span>
                        <div style={styles.loadingDots}>
                          <div className="dot" style={styles.dot}></div>
                          <div className="dot" style={styles.dot}></div>
                          <div className="dot" style={styles.dot}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={styles.inputContainer}>
                <div style={styles.inputGroup}>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Hỏi về sản phẩm hoặc cách mua hàng..."
                    style={{
                      ...styles.textInput,
                      ...(inputFocused ? styles.textInputFocus : {}),
                    }}
                    rows="1"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    style={{
                      ...styles.sendButton,
                      ...(!inputValue.trim() || isLoading
                        ? styles.sendButtonDisabled
                        : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(99,102,241,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GroqChatbot;
