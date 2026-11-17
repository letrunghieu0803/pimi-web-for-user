import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { CONTACT, CONTACT_MAILTO_HREF, CONTACT_TEL_HREF } from '@/constants/contact';

interface LegalSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ icon: Icon, title, children }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
      <Icon className="w-4 h-4 text-indigo-600" />
      {title}
    </h2>
    {children}
  </section>
);

/** Khối thông tin liên hệ dùng chung cho cuối Điều khoản và Chính sách bảo mật. */
export const LegalContactList: React.FC = () => (
  <ul className="list-disc pl-5 space-y-1">
    <li><strong>Đơn vị vận hành:</strong> {CONTACT.companyName}</li>
    <li><strong>Người đại diện:</strong> {CONTACT.representative}</li>
    <li><strong>Địa chỉ:</strong> {CONTACT.address}</li>
    <li>
      <strong>Điện thoại / Hotline:</strong>{' '}
      <a href={CONTACT_TEL_HREF} className="text-indigo-600 font-semibold hover:underline">{CONTACT.phoneDisplay}</a>
    </li>
    <li>
      <strong>Email:</strong>{' '}
      <a href={CONTACT_MAILTO_HREF} className="text-indigo-600 font-semibold hover:underline">{CONTACT.email}</a>
    </li>
  </ul>
);
