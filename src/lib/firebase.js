import { initializeApp, getApps, getApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

export const isFirebaseConfigured = () => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
    import.meta.env.VITE_FIREBASE_API_KEY &&
    !import.meta.env.VITE_FIREBASE_STORAGE_BUCKET.includes('your-app') &&
    !import.meta.env.VITE_FIREBASE_STORAGE_BUCKET.includes('placeholder')
  )
}

// Initialize Firebase App singleton
const app = getApps().length === 0 && isFirebaseConfigured()
  ? initializeApp(firebaseConfig)
  : (getApps().length > 0 ? getApp() : null)

export const storage = app ? getStorage(app) : null

/**
 * Upload a product image to Firebase Storage.
 * If Firebase is not configured, it returns a local base64 DataURL for instant preview.
 * @param {File} file 
 * @param {string} customName 
 * @returns {Promise<string>} Public image URL
 */
export const uploadProductImageToFirebase = async (file, customName = null) => {
  if (!file) return null

  if (isFirebaseConfigured() && storage) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = customName || `honey-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const storageRef = ref(storage, `products/${fileName}`)
      
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          brand: 'Fellas Honey'
        }
      }

      const snapshot = await uploadBytes(storageRef, file, metadata)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (err) {
      console.warn('Firebase Storage upload failed, falling back to local preview DataURL:', err)
    }
  }

  // Local Data URL fallback for instant preview without live Firebase setup
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

/**
 * Delete a product image from Firebase Storage
 * @param {string} imageUrl 
 */
export const deleteProductImageFromFirebase = async (imageUrl) => {
  if (!imageUrl || !isFirebaseConfigured() || !storage) return
  if (!imageUrl.includes('firebasestorage.googleapis.com')) return

  try {
    const storageRef = ref(storage, imageUrl)
    await deleteObject(storageRef)
  } catch (err) {
    console.warn('Firebase image deletion warning:', err)
  }
}
