export const themeConfig = {
  colors: {
    gold: '#d4af37',
    green: '#0f7938',
    black: '#000000',
    white: '#ffffff',
    lightGray: '#f5f5f5',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  
  fonts: {
    playfair: "'Playfair Display', serif",
    thai: "'Noto Sans Thai', sans-serif",
    fciconic: "'FCIconic', sans-serif",
    default: "'Inter', system-ui, -apple-system, sans-serif",
  },
  
  shadows: {
    text: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    card: '0 10px 30px rgba(0, 0, 0, 0.1)',
    button: '0 4px 6px rgba(0, 0, 0, 0.1)',
    buttonHover: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  
  spacing: {
    sectionPadding: {
      mobile: 'py-16',
      desktop: 'py-24',
    },
    containerPadding: {
      mobile: 'px-4',
      desktop: 'px-8',
    },
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'ease-out',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}