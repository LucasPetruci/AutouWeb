"use client";

import { useState } from "react";
import { 
  Card, Input, Button, Segmented, Upload, Typography, 
  Space, Tag, Empty, Spin, message
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { 
  InboxOutlined, SendOutlined, DeleteOutlined, 
  CopyOutlined, CheckOutlined, FileTextOutlined, FontSizeOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { EmailService } from "../services/Email.service";
import { EmailModel, EmailCategory } from "../types/Email";
import { useTranslation } from "../i18n/LanguageContext";

const { TextArea } = Input;
const { Text } = Typography;
const { Dragger } = Upload;

const DARK_BLUE = "#001020";
const GOLD_ORANGE = "#E0A030";

type InputMode = "text" | "file";

export function EmailClassifier() {
  const { translations, language } = useTranslation();
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [emailContent, setEmailContent] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<EmailModel | null>(null);

  const handleClassify = async () => {
    if (!emailContent && fileList.length === 0) return;

    setIsLoading(true);
    try {
      const file = fileList[0]?.originFileObj;
      const languageMap: Record<string, string> = {
        pt: "pt-BR",
        en: "en-US",
        es: "es-ES",
      };
      
      const response = await EmailService.classify({
        content: emailContent || undefined,
        file,
        language: languageMap[language],
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

  const getCategoryColor = (category: EmailCategory) => 
    category === "Productive" ? "success" : "warning";

  const getCategoryLabel = (category: EmailCategory) => 
    category === "Productive" 
      ? translations.classifier.result.productive 
      : translations.classifier.result.unproductive;

  return (
    <div style={{ display: "flex", gap: 32, flexDirection: "row", flexWrap: "wrap" }}>
      {/* @ts-expect-error - Ant Design v6 Card type issue */}
      <Card 
        style={{ 
          flex: "1 1 480px", 
          borderRadius: 16, 
          border: "none", 
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ 
              width: 4, 
              height: 20, 
              background: GOLD_ORANGE,
              borderRadius: 2
            }} />
            <Text strong style={{ fontSize: 13, letterSpacing: "0.05em", color: DARK_BLUE }}>
              {translations.classifier.input.title}
            </Text>
          </div>
        }
        extra={
          (emailContent || fileList.length > 0) && (
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={onClear}
              style={{ borderRadius: 8 }}
            >
              {translations.classifier.input.clear}
            </Button>
          )
        }
      >
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <Segmented
            block
            value={inputMode}
            onChange={(value: string | number) => setInputMode(value as InputMode)}
            options={[
              { label: translations.classifier.input.textTab, value: "text", icon: <FontSizeOutlined /> },
              { label: translations.classifier.input.fileTab, value: "file", icon: <FileTextOutlined /> },
            ]}
            style={{
              borderRadius: 12,
              padding: 4,
              background: "#f5f5f5",
            }}
          />

          {inputMode === "text" ? (
            <TextArea
              value={emailContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailContent(e.target.value)}
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
          ) : (
            <Dragger
              maxCount={1}
              fileList={fileList}
              beforeUpload={handleBeforeUpload}
              onRemove={() => setFileList([])}
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
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LoadingOutlined spin />
                {translations.classifier.input.analyzing}
              </span>
            ) : (
              translations.classifier.input.classifyButton
            )}
          </Button>
        </Space>
      </Card>

      {/* @ts-expect-error - Ant Design v6 Card type issue */}
      <Card 
        style={{ 
          flex: "1 1 480px", 
          borderRadius: 16, 
          border: "none", 
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.95)",
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ 
              width: 4, 
              height: 20, 
              background: GOLD_ORANGE,
              borderRadius: 2
            }} />
            <Text strong style={{ fontSize: 13, letterSpacing: "0.05em", color: DARK_BLUE }}>
              {translations.classifier.result.title}
            </Text>
          </div>
        }
      >
        {isLoading ? (
          <div style={{ padding: "100px 0", textAlign: "center" }}>
            <Spin 
              size="large" 
              indicator={
                <LoadingOutlined 
                  style={{ fontSize: 48, color: GOLD_ORANGE }} 
                  spin 
                />
              }
            />
            <div style={{ marginTop: 24 }}>
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
            </div>
          </div>
        ) : currentEmail ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12,
              padding: "16px 20px",
              background: `linear-gradient(135deg, ${GOLD_ORANGE}15, ${GOLD_ORANGE}08)`,
              borderRadius: 12,
              border: `1px solid ${GOLD_ORANGE}30`,
            }}>
              <Tag 
                color={getCategoryColor(currentEmail.category)}
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
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 6,
                marginLeft: "auto",
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: getCategoryColor(currentEmail.category) === "success" ? "#52c41a" : "#faad14",
                  boxShadow: `0 0 8px ${getCategoryColor(currentEmail.category) === "success" ? "#52c41a" : "#faad14"}`,
                }} />
                <Text style={{ fontSize: 13, fontWeight: 500, color: DARK_BLUE }}>
                  {Math.round(currentEmail.confidence * 100)}% {translations.classifier.result.confidence}
                </Text>
              </div>
            </div>

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

            <div
              style={{
                backgroundColor: "#fff",
                border: `2px solid ${GOLD_ORANGE}30`,
                borderRadius: 12,
                padding: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: GOLD_ORANGE,
              }} />
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: 16 
              }}>
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
              </div>
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
          </div>
        ) : (
          <div style={{ padding: "80px 0" }}>
            <Empty 
              description={
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: DARK_BLUE }}>
                    {translations.classifier.result.waiting}
                  </div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {translations.classifier.result.waitingSubtext}
                  </div>
                </div>
              } 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              styles={{ image: { opacity: 0.5 } }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
