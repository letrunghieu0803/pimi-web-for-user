import { axiosClient } from './axiosClient';

export interface HouseCollaborator {
  name: string;
  phone: string;
}

export const collaboratorApi = {
  getHouseCollaborators: (rentHouseId: string) => {
    return axiosClient.get<HouseCollaborator[]>(`/v1/rent-houses/${rentHouseId}/collaborators`);
  },
};
