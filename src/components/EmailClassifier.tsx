"use client";

import { useState } from "react";
import { 
  Input, Button, Segmented, Upload, Typography, 
  Space, Tag, Empty, Spin, message, Row, Col, Flex
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { 
  InboxOutlined, SendOutlined, DeleteOutlined, 
  CopyOutlined, CheckOutlined, FileTextOutlined, FontSizeOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { classifyEmail } from '../services/Email.service';
import { Email } from '../types/Email';
import { useTranslation } from "../i18n/LanguageContext";
import { CardWrapper } from "./CardWrapper";
import { ExampleButtons } from "./ExampleButtons";

const { TextArea } = Input;
const { Text } = Typography;
const { Dragger } = Upload;

const DARK_BLUE = "#001020";
const GOLD_ORANGE = "#E0A030";

const LANGUAGE_MAP: Record<Email.Language, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const CARD_STYLE = {
  borderRadius: 16,
  border: "none",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  background: "rgba(255, 255, 255, 0.95)",
  height: "100%",
};

const TITLE_INDICATOR_STYLE = {
  width: 4,
  height: 20,
  background: GOLD_ORANGE,
  borderRadius: 2,
};

const PRODUCTIVE_EXAMPLES = [
  "Olá,\n\nGostaria de agendar uma reunião para discutirmos o projeto que estamos desenvolvendo. Poderia disponibilizar alguns horários na próxima semana?\n\nAtenciosamente.",
  "Prezado(a),\n\nSeguem os documentos solicitados para análise. Por favor, revise e me informe se há necessidade de algum ajuste.\n\nAguardando retorno.\n\nCordialmente.",
  "Bom dia,\n\nConforme combinado, envio o relatório mensal com os resultados alcançados. Destaco os principais pontos:\n- Meta atingida: 95%\n- Crescimento: 12% em relação ao mês anterior\n\nEstou à disposição para esclarecimentos.\n\nAbraços.",
  "Olá,\n\nGostaria de propor uma melhoria no processo atual que pode aumentar nossa eficiência em aproximadamente 20%. Podemos conversar sobre isso?\n\nObrigado.",
];

const UNPRODUCTIVE_EXAMPLES = [
  "Oi!\n\nVocê viu aquele vídeo que eu mandei? É muito engraçado!\n\nManda aí o que você achou!\n\nValeu!",
  "E aí, beleza?\n\nCara, que dia chato hoje, né? Não aguento mais essa rotina...\n\nVocê também tá assim?\n\nFalou!",
  "Oi!\n\nSó queria compartilhar uma coisa aleatória que aconteceu hoje... estava indo trabalhar e vi um cachorro muito fofo na rua!\n\nEnfim, só isso mesmo hahaha\n\nTchau!",
  "E aí pessoal!\n\nAlguém viu aquele meme que circulou no grupo? Muito bom mesmo!\n\nBora fazer um happy hour essa semana?",
  "Oi!\n\nSó queria reclamar um pouco... que semana difícil! Não aguento mais essa correria.\n\nVocês também estão assim?\n\nDesabafo feito hahaha",
  "Olá!\n\nVocê assistiu aquela série que eu recomendei? Está muito boa! Precisamos conversar sobre o final, não acredito no que aconteceu!\n\nMe avisa quando terminar!\n\nAbraços!",
];

type InputMode = "text" | "file";

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <Space align="center" size={8}>
    <div style={TITLE_INDICATOR_STYLE} />
    <Text strong style={{ fontSize: 13, letterSpacing: "0.05em", color: DARK_BLUE }}>
      {children}
    </Text>
  </Space>
);

export function EmailClassifier() {
  const { translations, language } = useTranslation();
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [emailContent, setEmailContent] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<Email.Model | null>(null);

  const handleClassify = async () => {
    if (!emailContent && fileList.length === 0) return;

    setIsLoading(true);
    try {
      const response = await classifyEmail({
        content: emailContent || undefined,
        file: fileList[0]?.originFileObj,
        language: LANGUAGE_MAP[language],
      });

      const data = 'classification' in response ? response.classification : response;
      
      setCurrentEmail({
        id: crypto.randomUUID(),
        content: 'content_extracted' in response ? response.content_extracted : emailContent,
        category: data.category,
        suggestion: data.suggested_response,
        reasoning: data.reasoning,
        confidence: data.confidence,
        createdAt: new Date(data.processed_at),
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : translations.classifier.messages.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!currentEmail?.suggestion) return;

    await navigator.clipboard.writeText(currentEmail.suggestion);
    setCopied(true);
    message.success(translations.classifier.messages.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const onClear = () => {
    setEmailContent("");
    setFileList([]);
    setCurrentEmail(null);
  };

  const handleBeforeUpload: UploadProps["beforeUpload"] = (file) => {
    setFileList([{
      uid: file.uid,
      name: file.name,
      status: "done",
      originFileObj: file,
    } as UploadFile]);
    return false;
  };

  const getCategoryColor = (category: Email.Category) => 
    category === "Productive" ? "success" : "warning";

  const getCategoryLabel = (category: Email.Category) => 
    category === "Productive" 
      ? translations.classifier.result.productive 
      : translations.classifier.result.unproductive;

  const handleLoadExample = (type: "productive" | "unproductive") => {
    const examples = type === "productive" ? PRODUCTIVE_EXAMPLES : UNPRODUCTIVE_EXAMPLES;
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setEmailContent(randomExample);
  };

  const categoryColor = currentEmail ? getCategoryColor(currentEmail.category) : "success";
  const confidenceColor = categoryColor === "success" ? "#52c41a" : "#faad14";

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} sm={24} md={24} lg={12}>
        <CardWrapper 
          style={CARD_STYLE}
          title={<CardTitle>{translations.classifier.input.title}</CardTitle>}
          extra={(emailContent || fileList.length > 0) && (
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={onClear}
              style={{ borderRadius: 8 }}
            >
              {translations.classifier.input.clear}
            </Button>
          )}
        >
          <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            <Segmented
              block
              value={inputMode}
              onChange={(value) => setInputMode(value as InputMode)}
              options={[
                { label: translations.classifier.input.textTab, value: "text", icon: <FontSizeOutlined /> },
                { label: translations.classifier.input.fileTab, value: "file", icon: <FileTextOutlined /> },
              ]}
              style={{ borderRadius: 12, padding: 4, background: "#f5f5f5" }}
            />

            {inputMode === "text" ? (
              <>
                <ExampleButtons
                  onLoadProductive={() => handleLoadExample("productive")}
                  onLoadUnproductive={() => handleLoadExample("unproductive")}
                  translations={{
                    exampleProductive: (translations.classifier.input as any).exampleProductive || "Exemplo Produtivo",
                    exampleUnproductive: (translations.classifier.input as any).exampleUnproductive || "Exemplo Improdutivo",
                  }}
                />
                <TextArea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder={translations.classifier.input.placeholder}
                  autoSize={{ minRows: 14, maxRows: 14 }}
                  style={{ 
                    borderRadius: 12, 
                    padding: 16, 
                    border: "1px solid #e0e0e0",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                />
              </>
            ) : (
              <Dragger
                maxCount={1}
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
                onRemove={() => setFileList([])}
                accept=".txt,.pdf"
                style={{ 
                  borderRadius: 12, 
                  height: 280,
                  border: "2px dashed #d0d0d0",
                  backgroundColor: "#fafafa",
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: GOLD_ORANGE, fontSize: 48 }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 500, color: DARK_BLUE }}>
                  {translations.classifier.input.dragText}
                </p>
                <p className="ant-upload-hint" style={{ fontSize: 13, color: "#666" }}>
                  {translations.classifier.input.dragHint}
                </p>
              </Dragger>
            )}

            <Button
              type="primary"
              size="large"
              block
              icon={<SendOutlined />}
              loading={isLoading}
              disabled={!emailContent && fileList.length === 0}
              onClick={handleClassify}
              style={{ 
                height: 56, 
                borderRadius: 12, 
                fontWeight: 600, 
                fontSize: 16,
                background: GOLD_ORANGE,
                border: "none",
                boxShadow: `0 8px 24px ${GOLD_ORANGE}40`,
              }}
            >
              {isLoading ? (
                <Space>
                  <LoadingOutlined spin />
                  {translations.classifier.input.analyzing}
                </Space>
              ) : (
                translations.classifier.input.classifyButton
              )}
            </Button>
          </Space>
        </CardWrapper>
      </Col>

      <Col xs={24} sm={24} md={24} lg={12}>
        <CardWrapper 
          style={CARD_STYLE} 
          title={<CardTitle>{translations.classifier.result.title}</CardTitle>}
        >
          {isLoading ? (
            <Flex vertical align="center" justify="center" style={{ padding: "100px 0" }}>
              <Spin 
                size="large" 
                indicator={<LoadingOutlined style={{ fontSize: 48, color: GOLD_ORANGE }} spin />} 
              />
              <Flex vertical align="center" style={{ marginTop: 24 }}>
                <Text style={{ 
                  fontSize: 15, 
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 8,
                  color: DARK_BLUE,
                }}>
                  {translations.classifier.result.loading}
                </Text>
                <Text style={{ fontSize: 13, color: "#666" }}>
                  {translations.classifier.result.loadingSubtext}
                </Text>
              </Flex>
            </Flex>
          ) : currentEmail ? (
            <Flex vertical gap={28}>
              <Flex 
                align="center" 
                gap={12}
                style={{
                  padding: "16px 20px",
                  background: `linear-gradient(135deg, ${GOLD_ORANGE}15, ${GOLD_ORANGE}08)`,
                  borderRadius: 12,
                  border: `1px solid ${GOLD_ORANGE}30`,
                }}
              >
                <Tag 
                  color={categoryColor}
                  style={{ 
                    borderRadius: 24, 
                    padding: "6px 20px", 
                    fontSize: 14, 
                    fontWeight: 700, 
                    border: "none",
                  }}
                >
                  {getCategoryLabel(currentEmail.category)}
                </Tag>
                <Flex align="center" gap={6} style={{ marginLeft: "auto" }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: confidenceColor,
                    boxShadow: `0 0 8px ${confidenceColor}`,
                  }} />
                  <Text style={{ fontSize: 13, fontWeight: 500, color: DARK_BLUE }}>
                    {Math.round(currentEmail.confidence * 100)}% {translations.classifier.result.confidence}
                  </Text>
                </Flex>
              </Flex>

              <div style={{
                padding: 20,
                background: "#f8f9fa",
                borderRadius: 12,
                border: "1px solid #e9ecef",
              }}>
                <Text 
                  strong 
                  style={{ 
                    fontSize: 11, 
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "block",
                    marginBottom: 12,
                    color: DARK_BLUE,
                  }}
                >
                  {translations.classifier.result.contextualAnalysis}
                </Text>
                <p style={{ 
                  margin: 0, 
                  color: DARK_BLUE, 
                  lineHeight: 1.8,
                  fontSize: 14,
                }}>
                  {currentEmail.reasoning}
                </p>
              </div>

              <div style={{
                backgroundColor: "#fff",
                border: `2px solid ${GOLD_ORANGE}30`,
                borderRadius: 12,
                padding: 20,
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: GOLD_ORANGE,
                }} />
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                  <Text 
                    strong 
                    style={{ 
                      fontSize: 11, 
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: DARK_BLUE,
                    }}
                  >
                    {translations.classifier.result.suggestedResponse}
                  </Text>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />} 
                    onClick={handleCopy}
                    style={{ 
                      color: GOLD_ORANGE,
                      borderRadius: 8,
                      fontWeight: 500,
                    }}
                  >
                    {copied ? translations.classifier.result.copied : translations.classifier.result.copy}
                  </Button>
                </Flex>
                <p style={{ 
                  margin: 0, 
                  whiteSpace: "pre-wrap", 
                  fontSize: 14, 
                  color: DARK_BLUE,
                  lineHeight: 1.8,
                }}>
                  {currentEmail.suggestion}
                </p>
              </div>
            </Flex>
          ) : (
            <Flex vertical align="center" justify="center" style={{ padding: "80px 0" }}>
              <Empty 
                description={
                  <Flex vertical align="center">
                    <Text style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: DARK_BLUE }}>
                      {translations.classifier.result.waiting}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#666" }}>
                      {translations.classifier.result.waitingSubtext}
                    </Text>
                  </Flex>
                } 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                styles={{ image: { opacity: 0.5 } }}
              />
            </Flex>
          )}
        </CardWrapper>
      </Col>
    </Row>
  );
}
