import { axiosClient } from './axiosClient';

export interface InvoiceLineItem {
  id: string;
  type: 'SERVICE_FIXED' | 'SERVICE_USAGE' | 'SURCHARGE';
  name: string;
  unitPrice?: string | number | null;
  previousReading?: string | number | null;
  currentReading?: string | number | null;
  quantity?: string | number | null;
  amount: string | number;
}

export interface InvoiceContact {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'OVERDUE'
  | 'PAYOUT_COMPLETED'
  | 'CANCELLED';

export interface Invoice {
  id: string;
  status: InvoiceStatus;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  dueDate: string;
  roomRentAmount: string | number;
  otherFeesTotal: string | number;
  totalAmount: string | number;
  qrPaymentCode?: string | null;
  qrImageBase64?: string;
  lineItems: InvoiceLineItem[];
  rentRoom: { id: string; name: string };
  rentHouse: { id: string; name: string; street?: string | null };
  rentUser?: InvoiceContact | null;
  guestTenantName?: string | null;
  houseOwner?: InvoiceContact | null;
  [key: string]: unknown;
}

// Link "Xem chi tiết" gửi qua ZNS/email trỏ vào GET /v1/invoices/public/:id?token=... — không
// cần đăng nhập (bắt buộc với khách vãng lai không có tài khoản Pimi), an toàn nhờ `token`
// (crypto.randomBytes, xem InvoicesService.generateViewToken phía BE), không phải chỉ cần biết
// đúng invoiceId. KHÔNG dùng axiosClient cho các API cần cookie/CSRF khác của user đã đăng nhập —
// endpoint này hoàn toàn độc lập với phiên đăng nhập hiện tại (nếu có).
export const invoiceApi = {
  getPublic: (id: string, token: string) => {
    return axiosClient.get(`/v1/invoices/public/${id}`, { params: { token } });
  },
};
