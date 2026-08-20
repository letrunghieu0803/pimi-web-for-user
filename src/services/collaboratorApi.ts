import { axiosClient } from './axiosClient';

export interface HouseCollaborator {
  name: string;
  phone: string;
  // Kênh liên lạc chính thức — admin cài đặt cho từng cộng tác viên (xem ADMIN-Pimi). null nếu
  // admin chưa cài đặt link.
  zaloLink: string | null;
}

export const collaboratorApi = {
  getHouseCollaborators: (rentHouseId: string) => {
    return axiosClient.get<HouseCollaborator[]>(`/v1/rent-houses/${rentHouseId}/collaborators`);
  },
};
