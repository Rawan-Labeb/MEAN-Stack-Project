export interface CustomJwtPayload {
  sub?: string;
  id?: string;
  exp?: number;
  email?: string;
  role?: string;
  branchId?: string | null;
  branchName?: string | null;
  iat?: number;
}