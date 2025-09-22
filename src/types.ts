export interface Message {
    id: number;
    type: "user" | "bot" | "system";
    content: string;
    timestamp: Date;
  }
  
  export interface Vacancy {
    id: number;
    title: string;
    description: string;
    price: string;
  }
  
  export interface APIResponse {
    answer?: string;
    output?: string;
    message?: string;
    next?: boolean;
    vakansiya?: string;
    file_name?: string;
  }
  
  export interface UploadResponse {
    message: string;
    filename: string;
    detail?: string;
  }
  
  export interface WidgetProps {
    token: string;
    theme?: string;
    siteName?: string;
    enableLogging?: boolean;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    width?: string;
    height?: string;
    onReady?: () => void;
  }