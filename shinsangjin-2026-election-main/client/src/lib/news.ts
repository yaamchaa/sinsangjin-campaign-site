import { supabase } from "@/lib/supabase";

export type NewsCategory = "press" | "interview" | "media" | "video";
export type NewsStatus = "draft" | "published";

export type NewsItem = {
  id?: string;
  title: string;
  summary?: string | null;
  link: string;
  source?: string | null;
  category?: NewsCategory | null;
  published_at?: string | null;
  status?: NewsStatus | null;
  created_at?: string | null;
};

export async function getNews(limit = 20) {
  return supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
}

export async function getAdminNews(limit = 100) {
  return supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
}

export async function createNews(item: NewsItem) {
  return supabase.from("news").insert([item]).select();
}

export async function updateNews(id: string, item: Partial<NewsItem>) {
  return supabase
    .from("news")
    .update(item)
    .eq("id", id)
    .select();
}

export async function deleteNews(id: string) {
  return supabase.from("news").delete().eq("id", id);
}