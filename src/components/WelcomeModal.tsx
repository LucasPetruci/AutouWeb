"use client";

import { useEffect, useState } from "react";
import { Modal, Typography, Space, Button } from "antd";
import { MailOutlined, ThunderboltOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "../i18n/LanguageContext";

const { Title, Paragraph, Text } = Typography;

const DARK_BLUE = "#001020";
const GOLD_ORANGE = "#E0A030";

const STORAGE_KEY = "email-classifier-welcome-seen";

export function WelcomeModal() {
  const { translations } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button
          key="start"
          type="primary"
          size="large"
          onClick={handleClose}
          style={{
            background: GOLD_ORANGE,
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            height: 44,
            padding: "0 32px",
          }}
        >
          {(translations as any).welcome?.startButton || "Começar"}
        </Button>
      ]}
      width={600}
      centered
      closable={false}
      styles={{
        body: {
          padding: "32px",
        },
        header: {
          borderBottom: "none",
          paddingBottom: 0,
        },
      }}
      style={{
        borderRadius: 16,
      }}
    >
      <Space orientation="vertical" size={24} style={{ width: "100%", textAlign: "center" }}>
        <div style={{
          background: `linear-gradient(135deg, ${GOLD_ORANGE}15, ${GOLD_ORANGE}08)`,
          borderRadius: 16,
          padding: "24px",
          display: "flex",
          justifyContent: "center",
        }}>
          <MailOutlined style={{ fontSize: 64, color: GOLD_ORANGE }} />
        </div>

        <Title level={3} style={{ margin: 0, color: DARK_BLUE }}>
          {(translations as any).welcome?.title || "Bem-vindo ao Email Classifier"}
        </Title>

        <Paragraph style={{ fontSize: 15, color: "#666", lineHeight: 1.8, margin: 0 }}>
          {(translations as any).welcome?.description || 
            "Uma aplicação inteligente que utiliza Inteligência Artificial para classificar emails automaticamente como Produtivos ou Improdutivos, ajudando você a priorizar sua comunicação profissional."}
        </Paragraph>

        <Space orientation="vertical" size={16} style={{ width: "100%", textAlign: "left" }}>
          <Space size={12}>
            <ThunderboltOutlined style={{ color: GOLD_ORANGE, fontSize: 20 }} />
            <Text strong style={{ color: DARK_BLUE }}>
              {(translations as any).welcome?.feature1 || "Classificação Automática"}
            </Text>
          </Space>
          <Text style={{ color: "#666", marginLeft: 32, display: "block" }}>
            {(translations as any).welcome?.feature1Desc || 
              "Analise emails instantaneamente usando IA avançada"}
          </Text>

          <Space size={12}>
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
            <Text strong style={{ color: DARK_BLUE }}>
              {(translations as any).welcome?.feature2 || "Análise Contextual"}
            </Text>
          </Space>
          <Text style={{ color: "#666", marginLeft: 32, display: "block" }}>
            {(translations as any).welcome?.feature2Desc || 
              "Receba explicações detalhadas sobre cada classificação"}
          </Text>

          <Space size={12}>
            <MailOutlined style={{ color: GOLD_ORANGE, fontSize: 20 }} />
            <Text strong style={{ color: DARK_BLUE }}>
              {(translations as any).welcome?.feature3 || "Sugestões de Resposta"}
            </Text>
          </Space>
          <Text style={{ color: "#666", marginLeft: 32, display: "block" }}>
            {(translations as any).welcome?.feature3Desc || 
              "Obtenha respostas sugeridas baseadas no conteúdo do email"}
          </Text>
        </Space>
      </Space>
    </Modal>
  );
}
