/**
 * Cờ tính năng phía web người thuê.
 *
 * HOURLY_RENTAL_ENABLED: cho thuê ngắn hạn theo GIỜ. Mặc định TẮT (ẩn): không hiện giá giờ, không có lựa chọn "Thuê
 * theo giờ" khi đặt phòng; phòng chỉ có giá giờ coi như chưa có giá ngắn hạn. Bật lại: đặt
 * `VITE_HOURLY_RENTAL_ENABLED=true` lúc build (backend cũng phải bật `HOURLY_RENTAL_ENABLED=true`).
 */
export const HOURLY_RENTAL_ENABLED = import.meta.env.VITE_HOURLY_RENTAL_ENABLED === 'true';
