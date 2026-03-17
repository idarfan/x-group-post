export interface ImageEntry {
  file: File;    // 用於預覽（blob URL）
  path: string;  // 儲存到 DB 的路徑（預設檔名，可改為完整路徑）
}

export interface ShippingOptions {
  intl_shipping: boolean;
  tax: boolean;
  cvs_family: boolean;
  postal: boolean;
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

export interface TranslateResponse {
  translated_text: string;
  detected_language: string;
}

export interface GenerateResponse {
  post: string;
}
