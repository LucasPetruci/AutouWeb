"use client";

import { useState } from "react";
import { 
  Card, Input, Button, Segmented, Upload, Typography, 
  Space, Tag, Empty, Spin, message, theme 
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { 
  InboxOutlined, SendOutlined, DeleteOutlined, 
  CopyOutlined, CheckOutlined, FileTextOutlined, FontSizeOutlined 
} from "@ant-design/icons";
import { EmailService } from "../services/Email.service";
import { EmailModel, EmailCategory } from "../types/Email";
import { useTranslation } from "../i18n/LanguageContext";

const { TextArea } = Input;
const { Text } = Typography;
const { Dragger } = Upload;

type InputMode = "text" | "file";

export function EmailClassifier() {
  const { token } = theme.useToken();
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
    <div style={{ display: "flex", gap: 24, flexDirection: "row", flexWrap: "wrap" }}>
      {/* @ts-expect-error - Ant Design v6 Card type issue */}
      <Card 
        style={{ flex: "1 1 450px", borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        title={<Text type="secondary" strong>{translations.classifier.input.title}</Text>}
        extra={
          (emailContent || fileList.length > 0) && (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={onClear}>
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
          />

          {inputMode === "text" ? (
            <TextArea
              value={emailContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailContent(e.target.value)}
              placeholder={translations.classifier.input.placeholder}
              autoSize={{ minRows: 12, maxRows: 12 }}
              style={{ borderRadius: 8, padding: 12, border: "1px solid #f0f0f0" }}
            />
          ) : (
            <Dragger
              maxCount={1}
              fileList={fileList}
              beforeUpload={handleBeforeUpload}
              onRemove={() => setFileList([])}
              style={{ borderRadius: 8, height: 268 }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: token.colorPrimary }} />
              </p>
              <p className="ant-upload-text">{translations.classifier.input.dragText}</p>
              <p className="ant-upload-hint">{translations.classifier.input.dragHint}</p>
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
            style={{ height: 50, borderRadius: 10, fontWeight: 600, boxShadow: `0 4px 14px ${token.colorPrimary}40` }}
          >
            {isLoading ? translations.classifier.input.analyzing : translations.classifier.input.classifyButton}
          </Button>
        </Space>
      </Card>

      {/* @ts-expect-error - Ant Design v6 Card type issue */}
      <Card 
        style={{ flex: "1 1 450px", borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        title={<Text type="secondary" strong>{translations.classifier.result.title}</Text>}
      >
        {isLoading ? (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">{translations.classifier.result.loading}</Text>
            </div>
          </div>
        ) : currentEmail ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Space align="center" size="middle">
              <Tag 
                color={getCategoryColor(currentEmail.category)}
                style={{ borderRadius: 20, padding: "4px 16px", fontSize: 14, fontWeight: 600, border: "none" }}
              >
                {getCategoryLabel(currentEmail.category)}
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {Math.round(currentEmail.confidence * 100)}% {translations.classifier.result.confidence}
              </Text>
            </Space>

            <div>
              <Text type="secondary" strong style={{ fontSize: 11, textTransform: "uppercase" }}>
                {translations.classifier.result.contextualAnalysis}
              </Text>
              <p style={{ marginTop: 8, color: token.colorText, lineHeight: 1.6 }}>
                {currentEmail.reasoning}
              </p>
            </div>

            {/* @ts-expect-error - Ant Design v6 Card type issue */}
            <Card 
              size="small" 
              style={{ backgroundColor: "#f9f9f9", border: "1px solid #f0f0f0", borderRadius: 8 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text type="secondary" strong style={{ fontSize: 11, textTransform: "uppercase" }}>
                  {translations.classifier.result.suggestedResponse}
                </Text>
                <Button 
                  type="text" 
                  size="small" 
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />} 
                  onClick={handleCopy}
                  style={{ color: token.colorPrimary }}
                >
                  {copied ? translations.classifier.result.copied : translations.classifier.result.copy}
                </Button>
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: 14, color: "#444" }}>
                {currentEmail.suggestion}
              </p>
            </Card>
          </div>
        ) : (
          <div style={{ padding: "60px 0" }}>
            <Empty 
              description={translations.classifier.result.waitingSubtext} 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          </div>
        )}
      </Card>
    </div>
  );
}
