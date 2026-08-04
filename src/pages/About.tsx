import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ShieldCheck, HeartHandshake, Zap, Users, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-16 pb-16">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/70 to-slate-50 py-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{t('about.heroBadge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading">
            {t('about.heroTitleLine1')} <br />
            <span className="gradient-text">{t('about.heroTitleHighlight')}</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {t('about.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Core Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 font-heading">
              {t('about.storyTitle')}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('about.storyPara1')}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t('about.storyPara2')}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Target className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm font-heading">{t('about.missionTitle')}</h4>
                <p className="text-xs text-slate-500 mt-1">{t('about.missionDesc')}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Award className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm font-heading">{t('about.visionTitle')}</h4>
                <p className="text-xs text-slate-500 mt-1">{t('about.visionDesc')}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
              alt="Pimi Rental Platform"
              className="rounded-3xl shadow-2xl border border-slate-200 object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* 4 Core Values */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black font-heading">{t('about.coreValuesTitle')}</h2>
            <p className="text-slate-400 text-sm">
              {t('about.coreValuesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold font-heading">{t('about.value1Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('about.value1Desc')}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <Zap className="w-8 h-8 text-indigo-400" />
              <h3 className="text-lg font-bold font-heading">{t('about.value2Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('about.value2Desc')}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <HeartHandshake className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-bold font-heading">{t('about.value3Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('about.value3Desc')}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <Users className="w-8 h-8 text-amber-400" />
              <h3 className="text-lg font-bold font-heading">{t('about.value4Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('about.value4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-black text-slate-900 font-heading">{t('about.ctaTitle')}</h2>
        <Link
          to="/rooms"
          className="gradient-bg text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl inline-block hover:scale-105 transition-transform"
        >
          {t('about.ctaButton')}
        </Link>
      </section>

    </div>
  );
};
