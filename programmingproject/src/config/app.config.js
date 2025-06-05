export const APP_CONFIG = {
    schoolName: "Erasmus Hogeschool",
    apiBaseUrl: process.env.VITE_API_URL || 'http://localhost:3001/api',
    userTypes: [
      { id: 'student', label: 'STUDENT', path: '/dashboard/student' },
      { id: 'bedrijf', label: 'BEDRIJF', path: '/dashboard/company' },
      { id: 'werkzoekende', label: 'WERKZOEKENDE', path: '/dashboard/jobseeker' }
    ],
};