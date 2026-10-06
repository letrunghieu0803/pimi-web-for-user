import React from 'react';
import { Newspaper } from 'lucide-react';

interface NewsCoverProps {
  image: string | null;
  alt: string;
  className?: string;
}

// Ảnh bìa bài viết — bài không có ảnh thì hiện khung gradient + icon thay vì ảnh stock giả.
export const NewsCover: React.FC<NewsCoverProps> = ({ image, alt, className = '' }) =>
  image ? (
    <img src={image} alt={alt} className={className} loading="lazy" />
  ) : (
    <div className={`flex items-center justify-center bg-gradient-to-br from-indigo-100 to-slate-100 text-indigo-300 ${className}`}>
      <Newspaper className="w-10 h-10" />
    </div>
  );
