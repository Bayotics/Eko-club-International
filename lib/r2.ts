import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const UPLOAD_URL_TTL_SECONDS = 15 * 60
const READ_URL_TTL_SECONDS = 6 * 60 * 60

let cached: { client: S3Client; bucket: string } | null = null

function r2() {
  if (cached) return cached
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    throw new Error("Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME.")
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    forcePathStyle: true,
    // Newer SDKs add CRC32 checksum params to presigned URLs by default, which breaks browser PUTs to R2.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  })
  cached = { client, bucket: R2_BUCKET_NAME }
  return cached
}

export function presignUpload(key: string, contentType: string) {
  const { client, bucket } = r2()
  return getSignedUrl(client, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), {
    expiresIn: UPLOAD_URL_TTL_SECONDS,
  })
}

export function presignRead(key: string) {
  const { client, bucket } = r2()
  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: READ_URL_TTL_SECONDS,
  })
}

export async function headObject(key: string): Promise<{ size: number; contentType: string } | null> {
  const { client, bucket } = r2()
  try {
    const res = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return { size: res.ContentLength ?? 0, contentType: res.ContentType ?? "" }
  } catch (error: any) {
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === "NotFound") return null
    throw error
  }
}

export async function deleteObject(key: string) {
  const { client, bucket } = r2()
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
