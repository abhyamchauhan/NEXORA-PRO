import { v2 as cloudinary } from "cloudinary";

// Server-only Cloudinary config. The API secret never leaves the server — the
// browser uploads directly to Cloudinary using a short-lived signature minted
// by /api/admin/upload-signature (keeps admin uploads off our request body
// limits while never exposing the secret).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDER = "nexora/products";

export function isCloudinaryConfigured() {
  return (
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET
  );
}

/** Signs the given params for a direct browser upload. */
export function signUploadParams(params: Record<string, string | number>) {
  return cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET as string,
  );
}

export { cloudinary };
