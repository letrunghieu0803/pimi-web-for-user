import { Room } from '@/types';

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Phòng Studio Đầy Đủ Nội Thất Cao Cấp',
    houseName: 'Pimi Home Cầu Giấy',
    price: 4500000,
    depositPrice: 4500000,
    area: 28,
    roomFloor: 3,
    maxPeople: 2,
    status: 'EMPTY',
    roomType: 'APARTMENT',
    address: 'Số 15 Ngõ 68 Cầu Giấy, Phường Quan Hoa',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    imageThumbnails: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Điều hòa Inverter',
      'Bình nóng lạnh',
      'Ban công thoáng mát',
      'Tủ quần áo gỗ',
      'Tủ lạnh 150L',
      'Giường đệm cao cấp',
      'Bếp từ âm',
      'Wifi tốc độ cao',
      'Thang máy',
      'Khóa vân tay bảo mật',
    ],
    description: `Phòng trọ thiết kế kiểu Studio hiện đại, ngập tràn ánh sáng tự nhiên.
- Không gian sống văn minh, yên tĩnh.
- Có sẵn điều hòa, nóng lạnh, tủ lạnh, bếp nấu ăn, máy giặt dùng chung tầng 1.
- Ban công riêng phơi đồ cực kỳ thoáng.
- An ninh đảm bảo 24/7 với camera theo dõi và hệ thống khóa cửa vân tay thông minh.
- Vị trí đắc địa gần Đại học Quốc Gia, ĐH Sư Phạm, Báo Chí & Tuyên Truyền.`,
    latitude: 21.0341,
    longitude: 105.7876,
    hasMezzanine: false,
    isFeatured: true,
    createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'room-2',
    name: 'Căn Hộ Mini Có Gác Xép Rộng Trần Duy Hưng',
    houseName: 'Ký Túc Xá & Căn Hộ Pimi Luxury',
    price: 3800000,
    depositPrice: 3800000,
    area: 32,
    roomFloor: 4,
    maxPeople: 3,
    status: 'EMPTY',
    roomType: 'MINI_APARTMENT',
    address: 'Ngõ 204 Trần Duy Hưng, Phường Trung Hòa',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
    imageThumbnails: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Gác xép kiên cố',
      'Điều hòa',
      'Bình nóng lạnh',
      'Khu bếp riêng',
      'Chỗ để xe tầng 1 miễn phí',
      'Giặt sấy chung',
      'Giờ giấc tự do',
      'Không chung chủ',
    ],
    description: `Căn hộ gác xép trần cao 3.5m siêu thoáng mát tại khu vực Trung Hòa - Trần Duy Hưng.
- Gác xép rộng 10m2 để nệm ngủ thoải mái cho 2-3 người.
- Tầng dưới làm phòng khách & bếp riêng biệt.
- Gần BigC Thăng Long, Vincom Trần Duy Hưng, đường giao thông thuận tiện.
- Giờ giấc hoàn toàn tự do 24/24.`,
    hasMezzanine: true,
    isFeatured: true,
    createdAt: '2026-07-22T08:30:00Z',
  },
  {
    id: 'room-3',
    name: 'Phòng Trọ Khép Kín Giá Rẻ Gần ĐH Bách Khoa',
    houseName: 'Pimi House Tạ Quang Bửu',
    price: 2800000,
    depositPrice: 2800000,
    area: 22,
    roomFloor: 2,
    maxPeople: 2,
    status: 'EMPTY',
    roomType: 'BOARDING_HOUSE',
    address: 'Số 42 Ngõ 30 Tạ Quang Bửu, Phường Bách Khoa',
    district: 'Hai Bà Trưng',
    city: 'Hà Nội',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    imageThumbnails: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Khép kín 100%',
      'Bình nóng lạnh',
      'Quạt trần',
      'Wifi tốc độ cao',
      'Để xe máy tầng 1 có camera',
      'Nước máy Sông Đống',
    ],
    description: `Phòng trọ sinh viên vô cùng tiết kiệm ngay trung tâm Bách - Kinh - Xây.
- Cách trường ĐH Bách Khoa chỉ 300m đi bộ.
- Nhà ăn, chợ dân sinh ngay đầu ngõ cực tiện lợi.
- Điện nước công tơ riêng tính theo giá nhà nước chia đầu người.`,
    hasMezzanine: false,
    isFeatured: false,
    createdAt: '2026-07-24T14:15:00Z',
  },
  {
    id: 'room-4',
    name: 'Căn Hộ Dịch Vụ Ban Công View Đẹp Nguyễn Văn Trỗi',
    houseName: 'Pimi Serviced Apartment Phú Nhuận',
    price: 6500000,
    depositPrice: 6500000,
    area: 35,
    roomFloor: 5,
    maxPeople: 2,
    status: 'EMPTY',
    roomType: 'APARTMENT',
    address: '215 Nguyễn Văn Trỗi, Phường 10',
    district: 'Phú Nhuận',
    city: 'TP. Hồ Chí Minh',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    imageThumbnails: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Full nội thất cao cấp',
      'Sofa phòng khách',
      'Smart TV 43 inch',
      'Máy giặt riêng',
      'Bếp từ đôi & Hút mùi',
      'Thang máy tốc độ cao',
      'Dọn dẹp phòng 1 lần/tuần',
      'Bảo vệ 24/7',
    ],
    description: `Căn hộ dịch vụ hạng sang view thoáng mát ngay trục đường chính đi Sân bay Tân Sơn Nhất.
- Nội thất sang trọng tone màu Bắc Âu Scandinavia.
- Đã bao gồm chi phí dọn dẹp vệ sinh và nước sinh hoạt.
- Phù hợp người đi làm, chuyên gia hoặc cặp đôi sinh sống.`,
    hasMezzanine: false,
    isFeatured: true,
    createdAt: '2026-07-25T09:00:00Z',
  },
  {
    id: 'room-5',
    name: 'Phòng 1PN1WC Có Gác Hiện Đại Nguyễn Xí',
    houseName: 'Pimi House Bình Thạnh',
    price: 4200000,
    depositPrice: 4200000,
    area: 30,
    roomFloor: 2,
    maxPeople: 3,
    status: 'EMPTY',
    roomType: 'MINI_APARTMENT',
    address: '184 Nguyễn Xí, Phường 26',
    district: 'Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    imageThumbnails: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Gác xép đệm êm',
      'Điều hòa',
      'Nóng lạnh',
      'Tủ lạnh 2 cánh',
      'Khu vực rửa chén rộng',
      'Bãi xe rộng rãi',
      'Cửa vân tay',
    ],
    description: `Phòng mới sửa 100% cực xinh tại Bình Thạnh, đi Quận 1 chỉ 10 phút.
- Gần Gigamall Phạm Văn Đồng, Bến xe Miền Đông.
- Không chung chủ, bạn bè đến chơi thoải mái.`,
    hasMezzanine: true,
    isFeatured: false,
    createdAt: '2026-07-25T16:20:00Z',
  },
  {
    id: 'room-6',
    name: 'Phòng Trọ Ban Công Rộng Rãi Đường Thanh Niên',
    houseName: 'Pimi Westlake Tay Ho',
    price: 5200000,
    depositPrice: 5200000,
    area: 35,
    roomFloor: 4,
    maxPeople: 2,
    status: 'EMPTY',
    roomType: 'APARTMENT',
    address: 'Số 8 Ngõ 12 Thanh Niên, Phường Thụy Khuê',
    district: 'Tây Hồ',
    city: 'Hà Nội',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    imageThumbnails: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Ban công view Hồ Tây',
      'Full nội thất gỗ',
      'Điều hòa hai chiều',
      'Nóng lạnh',
      'Bếp điện',
      'Máy giặt tầng thượng',
      'Yên tĩnh tuyệt đối',
    ],
    description: `Căn phòng đáng sống nhất Tây Hồ với góc ban công chill tuyệt đẹp.
- Đi bộ 2 phút ra Hồ Tây hóng mát.
- Khu dân trí cao, an ninh tốt, gần chợ & siêu thị.`,
    hasMezzanine: false,
    isFeatured: true,
    createdAt: '2026-07-26T07:10:00Z',
  },
];

export const DISTRICTS = [
  'Tất cả quận/huyện',
  'Cầu Giấy',
  'Hai Bà Trưng',
  'Tây Hồ',
  'Thanh Xuân',
  'Đống Đa',
  'Phú Nhuận',
  'Bình Thạnh',
  'Quận 1',
  'Quận 7',
];

export const AMENITIES_LIST = [
  'Điều hòa',
  'Bình nóng lạnh',
  'Ban công',
  'Gác xép',
  'Thang máy',
  'Tủ lạnh',
  'Máy giặt',
  'Không chung chủ',
  'Giờ giấc tự do',
  'Khóa vân tay',
];

export interface HotLocation {
  id: string;
  district: string;
  name: string;
  city: string;
  roomCount: string;
  avgPrice: string;
  image: string;
  tag: string;
}

export const HOT_LOCATIONS: HotLocation[] = [
  {
    id: 'loc-1',
    district: 'Cầu Giấy',
    name: 'Quận Cầu Giấy',
    city: 'Hà Nội',
    roomCount: '480+ phòng',
    avgPrice: 'Từ 3.5 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    tag: '🔥 Hot Nhất Sinh Viên',
  },
  {
    id: 'loc-2',
    district: 'Tây Hồ',
    name: 'Quận Tây Hồ',
    city: 'Hà Nội',
    roomCount: '210+ phòng',
    avgPrice: 'Từ 4.8 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: '🌅 View Hồ Tây Chill',
  },
  {
    id: 'loc-3',
    district: 'Bình Thạnh',
    name: 'Quận Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    roomCount: '350+ phòng',
    avgPrice: 'Từ 3.8 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    tag: '⚡ Gần Trung Tâm Q1',
  },
  {
    id: 'loc-4',
    district: 'Thanh Xuân',
    name: 'Quận Thanh Xuân',
    city: 'Hà Nội',
    roomCount: '310+ phòng',
    avgPrice: 'Từ 3.2 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    tag: '🎓 Cụm Trường Đại Học',
  },
  {
    id: 'loc-5',
    district: 'Hai Bà Trưng',
    name: 'Quận Hai Bà Trưng',
    city: 'Hà Nội',
    roomCount: '290+ phòng',
    avgPrice: 'Từ 3.0 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80',
    tag: '🏛️ Bách - Kinh - Xây',
  },
  {
    id: 'loc-6',
    district: 'Đống Đa',
    name: 'Quận Đống Đa',
    city: 'Hà Nội',
    roomCount: '380+ phòng',
    avgPrice: 'Từ 3.6 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    tag: '🏬 Nhộn Nhịp Tiện Ích',
  },
  {
    id: 'loc-7',
    district: 'Quận 1',
    name: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    roomCount: '180+ phòng',
    avgPrice: 'Từ 5.5 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    tag: '🏙️ Đô Thị Sầm Uất',
  },
  {
    id: 'loc-8',
    district: 'Phú Nhuận',
    name: 'Quận Phú Nhuận',
    city: 'TP. Hồ Chí Minh',
    roomCount: '220+ phòng',
    avgPrice: 'Từ 4.2 triệu/tháng',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    tag: '✈️ Gần Sân Bay Tân Sơn Nhất',
  },
];

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: '5 Điều Khoản Vàng Khi Ký Hợp Đồng Thuê Trọ Tránh Mất Tiền Oan',
    category: 'Cẩm Nang Thuê Nhà',
    date: '05/08/2026',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Những điều khoản quan trọng về tiền cọc, chỉ số điện nước và thời hạn hợp đồng mà mọi người đi thuê cần phải thuộc lòng trước khi ký.',
    content: `Khi thuê phòng trọ hoặc căn hộ mini, hợp đồng thuê nhà chính là văn bản duy nhất bảo vệ quyền lợi hợp pháp của bạn. Dưới đây là 5 điều khoản quan trọng bạn nhất định phải kiểm tra kỹ:
1. Tiền cọc & điều kiện hoàn trả cọc: Thời gian thông báo báo trước khi dời đi (thường là 30 ngày) và cam kết hoàn 100% cọc.
2. Đơn giá dịch vụ điện nước rõ ràng: Đã bao gồm thuế hay chưa, chỉ số công tơ ban đầu ghi chép thực tế.
3. Trách nhiệm sửa chữa thiết bị hỏng hóc: Thiết bị xuống cấp tự nhiên do thời gian chủ nhà có nghĩa vụ sửa chữa.
4. Thời hạn hợp đồng & điều khoản gia hạn: Mức giá cam kết không tăng trong suốt thời hạn hợp đồng.
5. Danh mục kiểm kê nội thất bàn giao: Ghi rõ tình trạng hoạt động của điều hòa, nóng lạnh, giường tủ khi nhận phòng.`,
  },
  {
    id: 'news-2',
    title: 'Mẹo Tìm Phòng Trọ Sinh Viên Giá Rẻ Khu Vực Bách - Kinh - Xây',
    category: 'Kinh Nghiệm',
    date: '02/08/2026',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Tổng hợp kinh nghiệm chọn ngõ trọ an ninh, giá cả vừa túi tiền xung quanh ĐH Bách Khoa, Kinh tế Quốc dân và Xây dựng.',
    content: `Khu vực Bách - Kinh - Xây luôn có mật độ sinh viên cực kỳ đông đúc. Để tìm được phòng trọ ưng ý:
- Nên tìm phòng trong các tuyến ngõ Tạ Quang Bửu, Trần Đại Nghĩa, Lê Thanh Nghị, Giải Phóng.
- Ưu tiên nhà có cổng khóa vân tay hoặc camera an ninh 24/7.
- Kiểm tra khoảng cách đi bộ tới trường để tiết kiệm chi phí gửi xe và đi lại.
- Đặt lịch hẹn xem phòng trực tiếp trên Pimi để làm việc chính chủ không qua cò đất.`,
  },
  {
    id: 'news-3',
    title: 'Kinh Nghiệm Chọn Căn Hộ Mini Có Gác Xép Rộng & Thoáng Mát',
    category: 'Mẹo Chọn Phòng',
    date: '28/07/2026',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Làm thế nào để nhận biết căn hộ gác xép không bị bí nóng, chiều cao trần đạt chuẩn và cách bố trí nội thất tối ưu.',
    content: `Phòng có gác xép giúp gấp đôi diện tích sử dụng nhưng nếu thiết kế không chuẩn sẽ dễ bị hầm nóng vào mùa hè.
- Độ cao trần tối thiểu từ 3.2m đến 3.5m để khi đứng trên gác xép không bị đụng đầu.
- Nên chọn phòng gác xép có cửa sổ lớn hoặc lỗ thông gió tầng trên.
- Kiểm tra chất liệu gác: Gác đúc bê tông hoặc khung thép lót tấm cemboard kiên cố không bị vặn vẹo hay phát ra tiếng ồn khi đi lại.`,
  },
  {
    id: 'news-4',
    title: 'Cách Kiểm Tra Công Tơ Điện Nước Tránh Bị Chủ Nhà Tăng Giá Ảo',
    category: 'Pháp Lý & Giá Cả',
    date: '25/07/2026',
    readTime: '6 phút đọc',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Hướng dẫn kiểm tra rò rỉ điện, công tơ nước chạy sai và quy định mức giá trần điện nước theo quy định hiện hành.',
    content: `Nhiều bạn sinh viên gặp tình trạng hóa đơn điện nước tăng vọt bất thường mà không rõ nguyên nhân.
1. Thử ngắt toàn bộ thiết bị trong phòng: Nếu aptomat tắt mà công tơ vẫn quay tức là có hiện tượng rò điện hoặc đấu nối nhầm.
2. Kiểm tra chỉ số chốt đầu tháng: Chụp ảnh công tơ điện/nước vào ngày đầu tiên chuyển vào và định kỳ ngày 1 hàng tháng.
3. Tìm hiểu quy định giá điện sinh hoạt của nhà nước dành cho người thuê trọ.`,
  },
  {
    id: 'news-5',
    title: 'Quy Trình Đặt Cọc Giữ Phòng An Toàn 100% Trên Nền Tảng Pimi',
    category: 'Hướng Dẫn Pimi',
    date: '20/07/2026',
    readTime: '3 phút đọc',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Bảo vệ quyền lợi tuyệt đối khi đặt tiền giữ chỗ phòng trọ, nhận phiếu xác nhận điện tử từ chủ nhà minh bạch.',
    content: `Tránh tình trạng nộp tiền cọc giữ phòng rồi bị bùng phòng hoặc cướp tiền cọc.
- Chỉ đặt cọc sau khi đã đến xem phòng thực tế và xác minh thông tin chủ nhà trên Pimi.
- Nhận phiếu thu cọc điện tử hoặc giấy biên nhận có ghi rõ ngày dự kiến chuyển vào, số tiền cọc, và điều kiện phạt cọc nếu chủ nhà không giao phòng đúng hạn.`,
  },
];
