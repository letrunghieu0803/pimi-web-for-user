import { axiosClient } from './axiosClient';

export interface Contract {
  id: string;
  monthDurationToPay: number;
  rentDueDate: number;
  paymentMethod: string;
  roomCode?: string | null;
  roomName: string;
  roomFloor?: number | null;
  roomArea: string | number;
  roomPrice: string | number;
  roomType: string;
  rentHouseId: string;
  rentRoomId: string;
  // Không có houseOwner — endpoint /v1/contracts/mine không trả thông tin liên hệ chủ nhà cho
  // người thuê (xem contract.service.ts ở backend). Người thuê liên hệ qua cộng tác viên.
  rentHouse?: { id: string; name: string };
  isDeleted: boolean;
  isDeletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export const contractApi = {
  // Lịch sử hợp đồng thuê của chính người thuê — luôn gồm cả hợp đồng đã kết thúc (backend tự
  // set includeEnded=true cho route này), không cần truyền tham số.
  getMyContracts: (params?: { pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/contracts/mine', { params });
  },
};
