import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Calendar, ShieldCheck, FileText, PhoneCall } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Đặt Lịch Xem Phòng',
    question: 'Tôi bấm "Yêu cầu xem phòng" thì có mất phí dịch vụ gì không?',
    answer: 'Hoàn toàn KHÔNG. Việc đặt lịch hẹn và đến xem phòng trực tiếp thông qua Pimi là 100% miễn phí dành cho người đi thuê nhà.',
  },
  {
    category: 'Đặt Lịch Xem Phòng',
    question: 'Sau khi gửi yêu cầu xem phòng, bao lâu chủ nhà sẽ liên hệ lại?',
    answer: 'Thông thường chủ nhà sẽ liên hệ lại trực tiếp qua Số Điện Thoại của bạn trong vòng 15 - 30 phút để xác nhận khung giờ hẹn xem phòng.',
  },
  {
    category: 'Thông Tin Phòng',
    question: 'Hình ảnh và giá phòng đăng trên Pimi có chính xác không?',
    answer: 'Pimi cam kết tất cả thông tin về giá thuê, tiền cọc, diện tích và hình ảnh phòng đều được xác thực chính chủ từ chủ nhà đăng bài.',
  },
  {
    category: 'Thông Tin Phòng',
    question: 'Phòng có gác xép hay ban công được phân loại ra sao?',
    answer: 'Bạn có thể dùng bộ lọc thông minh trên trang "Danh sách phòng trọ" để lọc các phòng có gác xép kiên cố, ban công thoáng mát hay đầy đủ điều hòa, nóng lạnh.',
  },
  {
    category: 'Hợp Đồng & Tiền Cọc',
    question: 'Tôi làm hợp đồng thuê nhà trực tiếp với ai?',
    answer: 'Bạn sẽ làm việc, thỏa thuận và ký hợp đồng thuê nhà trực tiếp với Chủ nhà (Owner). Pimi không đứng ra làm môi giới hay thu giữ tiền cọc của bạn.',
  },
  {
    category: 'Hợp Đồng & Tiền Cọc',
    question: 'Cần lưu ý những gì trước khi đặt cọc phòng trọ?',
    answer: 'Bạn nên đến xem phòng thực tế, kiểm tra kỹ trang thiết bị (điều hòa, nóng lạnh, điện nước), đọc kỹ các điều khoản về thời hạn hợp đồng, mức cọc, giá điện nước sinh hoạt trước khi chuyển tiền đặt cọc.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Hỏi Đáp Thường Gặp</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Giải Đáp Thắc Mắc Người Thuê Nhà
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Những câu hỏi phổ biến nhất về cách tìm phòng, hẹn lịch xem phòng và quy trình thuê nhà trọ trên Pimi.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base font-heading hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold shrink-0">
                    {faq.category}
                  </span>
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need More Support Box */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-heading">Bạn vẫn còn thắc mắc cần trợ giúp?</h3>
          <p className="text-xs text-slate-400 mt-1">Đội ngũ hỗ trợ của Pimi sẵn sàng giải đáp 24/7 qua Hotline.</p>
        </div>
        <a
          href="tel:0987654321"
          className="gradient-bg text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shrink-0 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Hotline: 0987.654.321</span>
        </a>
      </div>

    </div>
  );
};
