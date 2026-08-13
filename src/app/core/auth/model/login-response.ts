export interface LoginResponse {
  accessToken: string | null;
  tokenType: string | null;
  expiresIn: number;

  roleSelectionRequired: boolean;
  roles: string[] | null;
  roleSelectionToken: string | null;
}
