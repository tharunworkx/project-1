import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://hbpnizfduywzrhyxtkiu.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BUCKET_NAME = 'receipts';

/**
 * Uploads a receipt image or document to the Supabase Storage 'receipts' bucket
 * and returns the public CDN URL.
 * 
 * @param {File|Blob} file The receipt file to upload
 * @param {string} [customFileName] Optional override for file name
 * @returns {Promise<{url: string, path: string, name: string, size: number}>}
 */
export async function uploadReceiptToSupabase(file, customFileName) {
  if (!file) {
    throw new Error('No receipt file provided');
  }

  const sanitizedOriginalName = (file.name || 'receipt')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();

  const fileExt = sanitizedOriginalName.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const filePath = `receipt_${timestamp}_${randomSuffix}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

  if (error) {
    console.error('Supabase Storage upload error:', error);
    throw error;
  }

  // Get public CDN URL for the uploaded file
  const { data: publicData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: publicData.publicUrl,
    path: filePath,
    name: file.name || filePath,
    size: file.size || 0,
  };
}

export default {
  supabase,
  uploadReceiptToSupabase,
};

