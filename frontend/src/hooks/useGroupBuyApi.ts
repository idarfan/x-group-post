import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { ProductInfo, TranslateResponse, GenerateResponse, GroupbuyPost } from "../types";

const API_BASE = "/api";

export function useGroupBuyApi() {
  const [loading, setLoading] = useState(false);

  const translate = async (text: string, sourceLang: string): Promise<TranslateResponse> => {
    setLoading(true);
    try {
      const { data } = await axios.post<TranslateResponse>(`${API_BASE}/ai/translate`, {
        text,
        source_language: sourceLang,
      });
      return data;
    } catch (e) {
      const msg = axios.isAxiosError(e) ? (e.response?.data as { error?: string })?.error ?? e.message : String(e);
      toast.error(`翻譯失敗：${msg}`);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const generate = async (
    translatedDescription: string,
    imageCount: number,
    productInfo: ProductInfo
  ): Promise<GenerateResponse> => {
    setLoading(true);
    try {
      const { data } = await axios.post<GenerateResponse>(`${API_BASE}/ai/generate`, {
        translated_description: translatedDescription,
        image_count: imageCount,
        product_info: productInfo,
      });
      return data;
    } catch (e) {
      const msg = axios.isAxiosError(e) ? (e.response?.data as { error?: string })?.error ?? e.message : String(e);
      toast.error(`生成失敗：${msg}`);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (
    postData: Record<string, string>,
    imagePaths: string[]
  ): Promise<GroupbuyPost> => {
    setLoading(true);
    try {
      const { data } = await axios.post<GroupbuyPost>(`${API_BASE}/posts`, {
        ...postData,
        image_paths: imagePaths,
      });
      toast.success("已儲存！");
      return data;
    } catch (e) {
      const msg = axios.isAxiosError(e)
        ? ((e.response?.data as { errors?: string[] })?.errors ?? []).join(", ") || e.message
        : String(e);
      toast.error(`儲存失敗：${msg}`);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const listPosts = async (): Promise<GroupbuyPost[]> => {
    try {
      const { data } = await axios.get<GroupbuyPost[]>(`${API_BASE}/posts`);
      return data;
    } catch {
      return [];
    }
  };

  const deletePost = async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/posts/${id}`);
    toast.success("已刪除");
  };

  return { loading, translate, generate, savePost, listPosts, deletePost };
}
