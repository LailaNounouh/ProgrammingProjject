import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APP_CONFIG } from '@/config/app.config'
import { useAuth } from '@/hooks/useAuth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const handleUserTypeSelect = (userType) => {
    login(userType)
    if (userType.id === 'bedrijf') {
      navigate('/profile/setup')
    } else {
      navigate(userType.path)
    }
  }

  return (
    <div className="flex-1 bg-gray-200 p-6">
      {/* Login content */}
    </div>
  )
}

export default LoginPage