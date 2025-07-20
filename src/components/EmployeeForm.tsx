import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { Employee, User as UserType } from '../types/employee';

interface EmployeeFormProps {
  employee?: Employee;
  currentUser: UserType;
  onSave: (employee: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  currentUser,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    employmentType: '正社員',
    hireDate: '',
    status: '在籍',
    userRole: '一般社員',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        department: employee.department,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        employmentType: employee.employmentType,
        hireDate: employee.hireDate,
        status: employee.status,
        userRole: employee.userRole,
      });
    }
  }, [employee]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Employee, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '氏名は必須です';
    }
    if (!formData.department.trim()) {
      newErrors.department = '所属は必須です';
    }
    if (!formData.position.trim()) {
      newErrors.position = '役職は必須です';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'メールアドレスの形式が正しくありません';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号は必須です';
    }
    if (!formData.hireDate) {
      newErrors.hireDate = '入社日は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isReadOnly = currentUser.role === '一般社員' && employee;
  const isAdmin = currentUser.role === '管理者';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {employee ? (isReadOnly ? '従業員詳細' : '従業員編集') : '新規従業員追加'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50 text-gray-600' : ''}`}
                placeholder="田中 太郎"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50 text-gray-600' : ''}`}
                placeholder="開発部"
              />
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役職 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.position ? 'border-red-300' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50 text-gray-600' : ''}`}
                placeholder="シニアエンジニア"
              />
              {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                雇用形態 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                }`}
              >
                <option value="正社員">正社員</option>
                <option value="契約社員">契約社員</option>
                <option value="派遣社員">派遣社員</option>
                <option value="アルバイト">アルバイト</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50 text-gray-600' : ''}`}
                placeholder="tanaka.taro@company.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50 text-gray-600' : ''}`}
                placeholder="090-1234-5678"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                入社日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.hireDate ? 'border-red-300' : 'border-gray-300'
                } ${isReadOnly ? 'bg-gray-50 text-gray-600' : ''}`}
              />
              {errors.hireDate && <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                }`}
              >
                <option value="在籍">在籍</option>
                <option value="退職">退職</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー権限 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.userRole}
                onChange={(e) => handleInputChange('userRole', e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isReadOnly ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                }`}
              >
                <option value="一般社員">一般社員</option>
                <option value="管理者">管理者</option>
              </select>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                保存
              </button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;