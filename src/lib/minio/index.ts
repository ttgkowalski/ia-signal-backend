import * as Minio from 'minio'

// export const MINIO_BUCKET = process.env.MINIO_BUCKET
// const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT
// const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY
// const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY
// const MINIO_PORT = process.env.MINIO_PORT
// export const minioClient = new Minio.Client({
//   endPoint: MINIO_ENDPOINT,
//   port: MINIO_PORT,
//   useSSL: true,
//   accessKey: MINIO_ACCESS_KEY,
//   secretKey: MINIO_SECRET_KEY,
// })

export async function uploadMinIO(
  objectName: string,
  fileBuffer: Buffer,
  fileMimeType: string
) {
  // const exists = await minioClient.bucketExists(MINIO_BUCKET)
  // if (!exists) {
  //   await minioClient.makeBucket(MINIO_BUCKET)
  // }
  // await minioClient.putObject(MINIO_BUCKET, objectName, fileBuffer, {
  //   'Content-Type': fileMimeType,
  // } as any)
  // return buildPublicUrl(objectName)
}

export function buildPublicUrl(objectName: string) {
  // return `https://${MINIO_ENDPOINT}/${MINIO_BUCKET}/${encodeURIComponent(
  //   objectName
  // )}`
}

export async function getPresignedUrl(objectName: string) {
  // return minioClient.presignedGetObject(MINIO_BUCKET, objectName)
}
