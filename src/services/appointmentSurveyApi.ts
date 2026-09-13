import { axiosClient } from './axiosClient';

export type AppointmentSurveyQuestionType = 'RATING' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT';

export interface AppointmentSurveyQuestion {
  id: string;
  label: string;
  type: AppointmentSurveyQuestionType;
  options?: string[] | null;
  isRequired: boolean;
  order: number;
}

export const appointmentSurveyApi = {
  // Bộ câu hỏi hiện hành (isDeleted:false, sắp theo order) — dùng để render form khảo sát lúc
  // người thuê xác nhận đã tham gia xem nhà (xem AttendanceSurveyModal.tsx).
  getActive: () => {
    return axiosClient.get('/v1/appointment-surveys/active');
  },
};
