export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  employmentType: '正社員' | '契約社員' | '派遣社員' | 'アルバイト';
  hireDate: string;
  status: '在籍' | '退職';
  userRole: '一般社員' | '管理者';
}

export interface User {
  id: string;
  name: string;
  role: '一般社員' | '管理者';
}