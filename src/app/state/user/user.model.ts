export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserStateModel {
  users: User[];
  page: number;
  isLoading: boolean;
  error: string | null;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export const USER_INITIAL_STATE: UserStateModel = {
  users: [],
  isLoading: false,
  error: null,
  page: 0,
  totalRecords: 0,
  totalPages: 0,
  currentPage: 0,
  perPage: 0,
};

export const defaultUser: User = {
  id: 0,
  email: '',
  first_name: '',
  last_name: '',
  avatar: '',
};
