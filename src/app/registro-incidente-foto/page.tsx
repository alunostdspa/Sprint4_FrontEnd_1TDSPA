"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { uploadImage } from "@/app/actions/upload-image"

export default function RegistroIncidente() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form fields
  const [gravidade, setGravidade] = useState("")
  const [tipoIncidente, setTipoIncidente] = useState("")
  const [descricao, setDescricao] = useState("")
  const [localIncidente, setLocalIncidente] = useState("") // Place name stored in latitude
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [imagemPath, setImagemPath] = useState<string | null>(null) // Path to the saved image

  // Handle image selection
  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagemFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove selected image
  const handleRemoveImage = () => {
    setImagemFile(null)
    setImagemPreview(null)
    setImagemPath(null)
    // Reset the file input
    const fileInput = document.getElementById("upload-foto") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  /**
   * Handle form submission
   * - Validates form data
   * - Uploads image if provided and saves the path
   * - Sends data to backend API
   * - Handles success/error responses
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Upload image if provided and get the path
      let uploadedImagePath = null
      if (imagemFile) {
        const formData = new FormData()
        formData.append("image", imagemFile)
        uploadedImagePath = await uploadImage(formData)
        setImagemPath(uploadedImagePath)
      }

      // Map form values to backend expected structure
      const incidenteData = {
        latitude: localIncidente, // Store place name in latitude field
        longitude: "", // No longer using longitude for image path
        descricao,
        gravidade: mapGravidadeToEnum(gravidade),
        nome: tipoIncidente,
        criador: user ? { id: user.id } : null,
        isResolved: false,
        imageUrl: uploadedImagePath || "", // Use the new imageUrl field
      }

      console.log("Sending incident data:", incidenteData)

      // Send data to backend API
      const response = await fetch("http://localhost:8080/api/incidentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(incidenteData),
      })

      // Log the full response for debugging
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]))

      // Get response text first for debugging
      const responseText = await response.text()
      console.log("Response text:", responseText)

      // Try to parse as JSON if possible
      let data = null
      try {
        data = responseText ? JSON.parse(responseText) : null
      } catch (error) {
        console.error("Failed to parse response as JSON:", error)
      }

      if (!response.ok) {
        throw new Error(data?.message || `Erro ao registrar incidente: ${response.status} ${response.statusText}`)
      }

      // Handle success
      setSuccess(true)
      console.log("Incidente registrado com sucesso:", data)

      // Reset form
      setGravidade("")
      setTipoIncidente("")
      setDescricao("")
      setLocalIncidente("")
      handleRemoveImage()

      // Show success message and redirect after delay
      setTimeout(() => {
        router.push("/historico")
      }, 2000)
    } catch (err) {
      console.error("Error submitting incident:", err)
      setError(err instanceof Error ? err.message : "Erro ao registrar incidente")
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Maps the form gravidade value to the backend enum
   */
  const mapGravidadeToEnum = (gravidade: string): string | null => {
    switch (gravidade.toLowerCase()) {
      case "baixa":
        return "BAIXA"
      case "media":
        return "MEDIA"
      case "alta":
        return "ALTA"
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="flex items-center transition-colors duration-300 mb-8 group" onClick={() => router.back()}>
        <i className="fa-solid fa-arrow-left mr-2 group-hover:translate-x-[-2px] transition-transform"></i>
        <span className="font-medium">Voltar</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#9D1919] text-white py-4 px-6">
          <h1 className="text-xl font-semibold">Registro de Incidente com Foto</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fa-solid fa-check-circle"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm">Incidente registrado com sucesso! Redirecionando...</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gravidade:</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white"
                value={gravidade}
                onChange={(e) => setGravidade(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Selecione a gravidade</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente:</label>
              <input
                type="text"
                placeholder="Ex: Falha no sistema, Acidente, etc."
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                value={tipoIncidente}
                onChange={(e) => setTipoIncidente(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Local do Incidente:</label>
            <input
              type="text"
              placeholder="Ex: Estação Osasco-Linha Diamante"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              value={localIncidente}
              onChange={(e) => setLocalIncidente(e.target.value)}
              required
              disabled={isLoading}
            />
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <i className="fa-solid fa-location-dot mr-1"></i>
              <span>Informe o local exato do incidente</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição:</label>
            <textarea
              placeholder="Descreva o incidente em detalhes..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 min-h-[150px] resize-y"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">Anexar Imagem:</label>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-2/3 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden h-[250px] flex items-center justify-center">
                {imagemPreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagemPreview || "/imagens/default-image.png"}
                      alt="Prévia da imagem do incidente"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-3">
                      <i className="fa-solid fa-upload text-gray-400"></i>
                    </div>
                    <p className="text-sm text-gray-500">Nenhuma imagem selecionada</p>
                    <p className="text-xs text-gray-400 mt-1">Formatos suportados: JPG, PNG, GIF</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/3 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="upload-foto"
                  onChange={handleImagemChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="upload-foto"
                  className={`w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <i className="fa-solid fa-upload mr-2"></i>
                  Selecionar Imagem
                </label>

                {imagemPreview && (
                  <button
                    type="button"
                    className="mt-3 text-sm text-red-600 hover:text-red-800"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    Remover imagem
                  </button>
                )}
              </div>
            </div>
            {imagemPath && (
              <div className="mt-2 text-xs text-gray-500">
                <p>
                  <strong>Caminho da imagem:</strong> {imagemPath}
                </p>
                <p className="mt-1">Este caminho será salvo no banco de dados para referência futura à imagem.</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-amber-600">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              <span className="text-sm">Verifique as informações antes de enviar</span>
            </div>

            <button
              type="submit"
              className="bg-[#9D1919] hover:bg-[#b11c1c] text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-300 shadow-sm hover:shadow flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2 text-sm"></i>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane mr-2 text-sm"></i>
                  Enviar Registro
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
