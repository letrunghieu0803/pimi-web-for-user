import { useEffect, type RefObject } from 'react';

/**
 * Đóng popover/dropdown khi bấm (chuột hoặc chạm) ra ngoài vùng `ref`, hoặc nhấn Esc. Vùng `ref` nên bọc cả nút mở lẫn
 * nội dung popover để bấm lại vào nút vẫn hoạt động như bật/tắt.
 */
export const useDismissOnOutside = (
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) => {
  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, open, onClose]);
};
