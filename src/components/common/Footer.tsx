import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight, PhoneCall, Shield, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white font-heading">
                Pimi<span className="text-indigo-400">Rent</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t('footer.brandDesc')}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/40 w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('footer.verifiedBadge')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold font-heading mb-4">{t('footer.exploreTitle')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>{t('footer.roomListLink')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  {t('footer.aboutLink')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-400 transition-colors">
                  {t('footer.faqLink')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>{t('footer.privacyLink')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-indigo-300 font-semibold">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>{t('footer.contactLink')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-white text-base font-bold font-heading mb-4">{t('footer.popularAreasTitle')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>{t('footer.area1')}</li>
              <li>{t('footer.area2')}</li>
              <li>{t('footer.area3')}</li>
              <li>{t('footer.area4')}</li>
              <li>{t('footer.area5')}</li>
            </ul>
          </div>

          {/* Contact & Hotline Section */}
          <div>
            <h4 className="text-white text-base font-bold font-heading mb-4">{t('footer.hotlineTitle')}</h4>
            <div className="space-y-4 text-sm">
              {/* Highlighted Hotline Button */}
              <a
                href="tel:0987654321"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-900 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">{t('footer.hotlineLabel')}</span>
                  <span className="text-base font-black text-white font-heading">0987.654.321</span>
                </div>
              </a>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-400 text-xs">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{t('footer.address')}</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-xs">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>support@pimi.vn</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pimi Platform. {t('footer.rightsReserved')}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">{t('footer.privacyLink')}</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">{t('footer.contactLink')}</Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>{t('footer.madeFor')}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
