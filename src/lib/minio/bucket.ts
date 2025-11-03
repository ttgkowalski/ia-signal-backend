import { minioClient } from '.'

const bucketName = 'ia-signal-uploads'

async function createBucketIfNotExists() {
  const exists = await minioClient.bucketExists(bucketName)
  if (!exists) {
    await minioClient.makeBucket(bucketName)
    console.log(`Bucket created: '${bucketName}'`)
  } else {
    console.log(`Bucket already exists: '${bucketName}'`)
  }
}

createBucketIfNotExists()
