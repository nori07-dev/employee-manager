import React from 'react';
import { Users, Settings, LogOut } from 'lucide-react';
import { User } from '../types/employee';

interface HeaderProps {
  currentUser: User;
  onUserChange: (user: User) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onUserChange }) => {
  const switchUser = () => {
    const newRole = currentUser.role === '管理者' ? '一般社員' : '管理者';
    const newUser: User = {
      ...currentUser,
      role: newRole,
      name: newRole === '管理者' ? '田中 太郎' : '佐藤 花子',
    };
    onUserChange(newUser);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">従業員管理システム</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">ログイン中:</span>
              <span className="font-medium text-gray-900">{currentUser.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentUser.role === '管理者' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {currentUser.role}
              </span>
            </div>
            
            <button
              onClick={switchUser}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="ユーザー切り替え（デモ用）"
            >
              <Settings className="h-4 w-4" />
              <span>切り替え</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;