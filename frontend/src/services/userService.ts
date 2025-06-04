import { api } from '../api/client';

const userService = {
  updateUserActivity: async (date: string, duration_minutes: number) => {
    const response = await api.patch("user-activity/", { date, duration_minutes });
    return response.data;
  },
};

export default userService;