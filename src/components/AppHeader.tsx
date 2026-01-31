"use client";

import { Layout, Button, Dropdown, Space, Typography, Row, Col, Grid } from 'antd';
import { MailOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from '../i18n/LanguageContext';
import { Email } from '../types/Email';

const { Header } = Layout;
const { Text } = Typography;

const DARK_BLUE = "#001020";
const GOLD_ORANGE = "#E0A030";

const languageLabels = {
  pt: "Português",
  en: "English",
  es: "Español",
} as const;

export function AppHeader() {
  const { language, setLanguage, translations } = useTranslation();
  const { xs, sm } = Grid.useBreakpoint();

  const items: MenuProps['items'] = [
    { key: 'pt', label: 'Português' },
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Español' },
  ];

  const handleMenuClick: MenuProps['onClick'] = (info: Parameters<NonNullable<MenuProps['onClick']>>[0]) => {
    setLanguage(info.key as Email.Language);
  };

  const isMobile = xs || sm;

  return (
    <Header style={{ 
      background: `linear-gradient(135deg, ${DARK_BLUE} 0%, #001830 100%)`,
      backdropFilter: 'blur(20px)',
      padding: isMobile ? '0 16px' : '0 48px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: isMobile ? '64px' : '80px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
      borderBottom: `1px solid rgba(224, 160, 48, 0.2)`,
    }}>
      <Row justify="space-between" align="middle" style={{ height: '100%' }}>
        <Col flex="auto">
          <Space size={isMobile ? 8 : 16} wrap>
            <div style={{ 
              background: GOLD_ORANGE,
              width: isMobile ? 36 : 48, 
              height: isMobile ? 36 : 48, 
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${GOLD_ORANGE}40`,
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
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
              <MailOutlined style={{ 
                color: DARK_BLUE, 
                fontSize: isMobile ? 18 : 22, 
                position: 'relative', 
                zIndex: 1, 
                fontWeight: 'bold' 
              }} />
            </div>
            <Col>
              <Text strong style={{ 
                fontSize: isMobile ? 16 : 20, 
                letterSpacing: '-0.02em',
                color: GOLD_ORANGE,
                display: 'block',
                lineHeight: 1.2,
              }}>
                {translations.header.title}
              </Text>
            </Col>
          </Space>
        </Col>

        <Col flex="none">
          <Dropdown 
            menu={{ items, onClick: handleMenuClick, selectedKeys: [language] }} 
            trigger={['click']}
          >
            <Button 
              type="text" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: isMobile ? 36 : 44,
                borderRadius: 10,
                padding: isMobile ? '0 12px' : '0 16px',
                background: 'rgba(224, 160, 48, 0.1)',
                border: `1px solid rgba(224, 160, 48, 0.3)`,
              }}
            >
              <Space size={isMobile ? 6 : 10}>
                <GlobalOutlined style={{ color: GOLD_ORANGE, fontSize: isMobile ? 14 : 16 }} />
                {!isMobile && (
                  <Text style={{ fontWeight: 500, fontSize: isMobile ? 12 : 14, color: 'white' }}>
                    {languageLabels[language]}
                  </Text>
                )}
                <DownOutlined style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.6)' }} />
              </Space>
            </Button>
          </Dropdown>
        </Col>
      </Row>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </Header>
  );
}
