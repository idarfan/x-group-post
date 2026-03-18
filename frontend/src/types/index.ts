export interface ImageEntry {
  file: File;    // 用於預覽（blob URL）
  path: string;  // 儲存到 DB 的路徑（預設檔名，可改為完整路徑）
}

export interface ShippingOptions {
  intl_shipping: boolean;
  tax: boolean;
  /** "" = 不含物流、"cvs_family" = 全家店到店（已含）、"postal" = 郵寄（已含） */
  delivery: "" | "cvs_family" | "postal";
  /** 全家店到店費用，僅 delivery === "cvs_family" 時有效 */
  cvs_family_fee: 68 | 72 | 78;
  note: string;
}

export interface ProductInfo {
  name: string;
  original_price: string;
  group_price: string;
  start_date: string;
  end_date: string;
  order_method: string;
  shipping: ShippingOptions;
}

export interface GroupbuyPost {
  id: number;
  product_name: string;
  group_price: string;
  status: "draft" | "published";
  created_at: string;
  post_images: PostImage[];
}

export interface PostImage {
  id: number;
  filename: string;
  position: number;
  image_path: string;
  path_type: "windows" | "wsl2" | "linux";
}

export interface ThemeConfig {
  // 背景顏色
  bgPrimary: string;
  bgCard: string;
  bgInput: string;
  // 文字顏色
  textPrimary: string;
  textSecondary: string;
  // 強調色
  accent: string;
  accentHover: string;
  focusColor: string;   // 輸入框 focus 邊框色
  danger: string;
  success: string;
  warning: string;
  // 邊框
  border: string;
  radius: number;         // px
  // 字體
  fontFamily: string;
  fontSizeBase: number;   // px
  fontSizeSm: number;     // px
  fontSizeLg: number;     // px
  fontSizeXl: number;     // px
  fontWeightNormal: number;
  fontWeightBold: number;
  lineHeight: number;
  letterSpacing: number;  // px
  // 間距 (rem)
  spacingSm: number;
  spacingMd: number;
  spacingLg: number;
  // 特效
  shadowEnabled: boolean;
  transitionSpeed: number; // ms
  backdropBlurEnabled: boolean;
  inputOpacity: number;   // 0~1
}

export interface TranslateResponse {
  translated_text: string;
  detected_language: string;
}

export interface GenerateResponse {
  post: string;
}
