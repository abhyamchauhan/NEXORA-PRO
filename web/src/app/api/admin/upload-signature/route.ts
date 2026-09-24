import { getAdminSession, forbidden } from "@/lib/auth-guard";
import {
  CLOUDINARY_FOLDER,
  isCloudinaryConfigured,
  signUploadParams,
} from "@/lib/cloudinary";

// Mints a short-lived signature so the admin's browser can upload directly to
// Cloudinary. Admin-only (re-checked here, independent of middleware).
export async function POST() {
  const session = await getAdminSession();
  if (!session) return forbidden();

  if (!isCloudinaryConfigured()) {
    return Response.json(
      { error: "Cloudinary is not configured. Set the CLOUDINARY_* env vars." },
      { status: 503 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: CLOUDINARY_FOLDER };
  const signature = signUploadParams(paramsToSign);

  return Response.json({
    timestamp,
    signature,
    folder: CLOUDINARY_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
