import React, { useEffect } from 'react';
import { SITE_NAME, DEFAULT_SEO, absoluteUrl } from '@/config/seo';

// index.html giữ vài thẻ <meta name="description">/OG/Twitter TĨNH làm fallback cho bot không
// chạy JS, đánh dấu data-default="true". React 19 tự dedupe <title> nó render nhưng KHÔNG tự
// gỡ các thẻ <meta> không do nó tạo ra — nếu để cả 2 tồn tại, trình duyệt/bot sẽ lấy thẻ ĐẦU
// TIÊN trong DOM (tức bản tĩnh chung chung) thay vì bản <Seo> render riêng cho từng trang. Gỡ
// một lần duy nhất ngay khi <Seo> đầu tiên mount là đủ — từ đó về sau chỉ còn thẻ do React quản.
let staticDefaultsRemoved = false;
function removeStaticDefaultTags() {
  if (staticDefaultsRemoved) return;
  staticDefaultsRemoved = true;
  document.querySelectorAll('[data-default="true"]').forEach((el) => el.remove());
}

interface SeoProps {
  /** Tiêu đề riêng của trang — sẽ tự nối " | Pimi". Bỏ trống thì dùng tiêu đề mặc định toàn site. */
  title?: string;
  description?: string;
  /** Đường dẫn tương đối (vd "/rooms/abc") dùng để build canonical + og:url. Bắt buộc với mọi trang public. */
  path?: string;
  /** URL ảnh tuyệt đối hoặc tương đối dùng cho og:image/twitter:image. Bỏ trống thì không render thẻ ảnh
   *  (cố tình không fallback về ảnh chung chung — xem ghi chú trong DEVELOPMENT_LOG.md). */
  image?: string;
  /** 'article' cho trang tin tức/bài viết, mặc định 'website'. */
  type?: 'website' | 'article';
  /** Đặt true cho các trang riêng tư (đăng nhập, hồ sơ, đặt phòng...) — chèn <meta name="robots" content="noindex, nofollow">. */
  noindex?: boolean;
}

/**
 * Quản lý <title>/<meta>/<link> theo từng trang bằng cơ chế hoisting-to-<head> có sẵn của
 * React 19 (render <title>/<meta>/<link> ở bất kỳ đâu trong cây component, React tự đưa lên
 * <head> và loại trùng) — không cần thêm thư viện như react-helmet-async.
 *
 * Lưu ý: đây là app CSR thuần (Vite + React Router, không SSR/prerender), nên các thẻ này chỉ
 * tồn tại SAU khi JS chạy xong. Google/Bing index được vì crawler của họ chạy JS, nhưng bot xem
 * trước link không chạy JS (Facebook/Zalo/Telegram...) sẽ chỉ thấy bản tĩnh trong index.html.
 */
export const Seo: React.FC<SeoProps> = ({ title, description, path, image, type = 'website', noindex }) => {
  useEffect(() => {
    removeStaticDefaultTags();
  }, []);

  const finalTitle = DEFAULT_SEO.titleTemplate(title || '');
  const finalDescription = description || DEFAULT_SEO.description;
  const url = path ? absoluteUrl(path) : undefined;
  const imageUrl = image ? absoluteUrl(image) : undefined;

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {url && <meta property="og:url" content={url} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </>
  );
};
