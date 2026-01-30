"use client";

import { Layout, Button, Dropdown, Space, Typography, theme } from 'antd';
import { MailOutlined, GlobalOutlined, DownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from '../i18n/LanguageContext';

const { Header } = Layout;
const { Text } = Typography;

export function AppHeader() {
  const { token } = theme.useToken();
  const { language, setLanguage, translations } = useTranslation();

  const items: MenuProps['items'] = [
    { key: 'pt', label: 'Português' },
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Español' },
  ];

  const languageLabels: Record<string, string> = {
    pt: "Português",
    en: "English",
    es: "Español",
  };

  const handleMenuClick: MenuProps['onClick'] = (info: Parameters<NonNullable<MenuProps['onClick']>>[0]) => {
    setLanguage(info.key as typeof language);
  };

  return (
    <Header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      padding: '0 48px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '80px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    }}>
      <Space size={16}>
        <div style={{ 
          background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}dd)`,
          width: 48, 
          height: 48, 
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 24px ${token.colorPrimary}30`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />
          <MailOutlined style={{ color: 'white', fontSize: 22, position: 'relative', zIndex: 1 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <Text strong style={{ 
            fontSize: 20, 
            letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}dd)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {translations.header.title}
          </Text>
          <Space size={4} style={{ marginTop: 2 }}>
            <ThunderboltOutlined style={{ fontSize: 10, color: token.colorPrimary }} />
            <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
              {translations.header.subtitle}
            </Text>
          </Space>
        </div>
      </Space>

      <Dropdown 
        menu={{ 
          items, 
          onClick: handleMenuClick, 
          selectedKeys: [language] 
        }} 
        trigger={['click']}
      >
        <Button 
          type="text" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            height: 44,
            borderRadius: 10,
            padding: '0 16px',
            background: token.colorFillTertiary,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Space size={10}>
            <GlobalOutlined style={{ color: token.colorPrimary, fontSize: 16 }} />
            <Text style={{ fontWeight: 500, fontSize: 14 }}>{languageLabels[language]}</Text>
            <DownOutlined style={{ fontSize: 10, color: token.colorTextDescription }} />
          </Space>
        </Button>
      </Dropdown>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </Header>
  );
}
