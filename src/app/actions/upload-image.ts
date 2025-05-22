"use server"

import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

/**
 * Generates a unique ID for filenames
 * This is a fallback in case uuid is not available
 */
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Uploads an image to the public/imagens/incidente directory
 * @param formData FormData containing the image file
 * @returns The path to the saved image
 */
export async function uploadImage(formData: FormData): Promise<string | null> {
  try {
    const file = formData.get("image") as File

    if (!file || file.size === 0) {
      return null
    }

    // Create directory if it doesn't exist
    const dirPath = join(process.cwd(), "public", "imagens", "incidente")
    try {
      await mkdir(dirPath, { recursive: true })
    } catch {
      console.log("Directory already exists or cannot be created")
    }

    // Generate a unique filename to prevent overwriting
    const fileExtension = file.name.split(".").pop()

    // Try to use uuid if available, otherwise use our fallback function
    let uniqueId
    try {
      // Dynamic import to avoid build errors if uuid is not installed
      const { v4: uuidv4 } = await import("uuid")
      uniqueId = uuidv4()
    } catch {
      // Fallback to our simple unique ID generator
      uniqueId = generateUniqueId()
    }

    const fileName = `${uniqueId}.${fileExtension}`
    const filePath = join(dirPath, fileName)

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write the file to the public/imagens/incidente directory
    await writeFile(filePath, buffer)

    // Return the path relative to the public directory
    return `/imagens/incidente/${fileName}`
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}
