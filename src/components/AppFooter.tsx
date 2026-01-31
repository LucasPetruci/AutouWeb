"use client";

import { Layout, Typography, Space, Row, Col } from 'antd';
import { LinkedinOutlined, GithubOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text } = Typography;

const DARK_BLUE = "#001020";
const GOLD_ORANGE = "#E0A030";

export function AppFooter() {
  return (
    <Footer style={{
      background: `linear-gradient(135deg, ${DARK_BLUE} 0%, #001830 100%)`,
      borderTop: `1px solid rgba(224, 160, 48, 0.2)`,
      padding: '24px 48px',
      flexShrink: 0,
    }}>
      <Row justify="center" align="middle">
        <Col>
          <Space orientation="vertical" align="center" size={8}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>
              Desenvolvido por <Text strong style={{ color: GOLD_ORANGE }}>Lucas Petruci</Text>
            </Text>
            <Space size={16}>
              <a
                href="https://www.linkedin.com/in/lucaspetruci/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: GOLD_ORANGE, fontSize: 20 }}
              >
                <LinkedinOutlined />
              </a>
              <a
                href="https://github.com/LucasPetruci"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: GOLD_ORANGE, fontSize: 20 }}
              >
                <GithubOutlined />
              </a>
            </Space>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
}
