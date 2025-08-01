"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Download, CreditCard, Check, AlertCircle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type ProcessingState = "idle" | "uploading" | "processing" | "completed" | "error"

interface ProcessedImage {
  originalUrl: string
  processedUrl: string
  watermarkedUrl: string
  filename: string
}

export default function BackgroundRemoverPage() {
  const [processingState, setProcessingState] = useState<ProcessingState>("idle")
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null)
  const [error, setError] = useState<string>("")
  const [dragActive, setDragActive] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  // Simular procesamiento de imagen
  const processImage = async (file: File): Promise<ProcessedImage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const originalUrl = URL.createObjectURL(file)
        // Simular URLs de imagen procesada
        const processedUrl = originalUrl // En producción sería la imagen sin fondo
        const watermarkedUrl = originalUrl // En producción sería con marca de agua

        resolve({
          originalUrl,
          processedUrl,
          watermarkedUrl,
          filename: file.name,
        })
      }, 3000) // Simular 3 segundos de procesamiento
    })
  }

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError("Formato no permitido. Solo se aceptan JPG, PNG y WEBP.")
      return false
    }

    if (file.size > maxSize) {
      setError("El archivo es demasiado grande. Máximo 10MB.")
      return false
    }

    return true
  }

  const handleFileUpload = async (file: File) => {
    setError("")

    if (!validateFile(file)) {
      setProcessingState("error")
      return
    }

    setProcessingState("processing")

    try {
      const result = await processImage(file)
      setProcessedImage(result)
      setProcessingState("completed")
    } catch (err) {
      setError("Error procesando la imagen. Inténtalo de nuevo.")
      setProcessingState("error")
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const downloadWithWatermark = () => {
    if (processedImage) {
      // Simular descarga
      const link = document.createElement("a")
      link.href = processedImage.watermarkedUrl
      link.download = `no-bg-watermark-${processedImage.filename}`
      link.click()
    }
  }

  const handlePayment = async () => {
    // Simular proceso de pago
    setProcessingState("processing")

    setTimeout(() => {
      setIsPaid(true)
      setProcessingState("completed")
    }, 2000)
  }

  const downloadHD = () => {
    if (processedImage && isPaid) {
      // Simular descarga HD
      const link = document.createElement("a")
      link.href = processedImage.processedUrl
      link.download = `no-bg-hd-${processedImage.filename}`
      link.click()
    }
  }

  const resetFlow = () => {
    setProcessingState("idle")
    setProcessedImage(null)
    setError("")
    setIsPaid(false)
    setDragActive(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BgRemover</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Elimina el Fondo de tus Imágenes</h1>
            <p className="text-xl text-gray-600 mb-8">Sube tu imagen y obtén un resultado profesional en segundos</p>
          </div>

          {/* Upload Section */}
          {processingState === "idle" && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Arrastra tu imagen aquí</h3>
                  <p className="text-gray-600 mb-4">o haz clic para seleccionar un archivo</p>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    ref={(input) => {
                      if (input) {
                        input.onclick = () => (input.value = "")
                      }
                    }}
                  />

                  <Button onClick={() => document.getElementById("file-upload")?.click()} className="cursor-pointer">
                    Seleccionar Imagen
                  </Button>

                  <p className="text-sm text-gray-500 mt-4">Formatos soportados: JPG, PNG, WEBP (máx. 10MB)</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing State */}
          {processingState === "processing" && (
            <Card className="mb-8">
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isPaid ? "Procesando pago..." : "Procesando imagen..."}
                </h3>
                <p className="text-gray-600">{isPaid ? "Confirmando tu pago" : "Eliminando el fondo de tu imagen"}</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {processingState === "error" && (
            <Alert className="mb-8" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Section */}
          {processingState === "completed" && processedImage && (
            <div className="space-y-8">
              {/* Image Comparison */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Resultado</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Original</p>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={processedImage.originalUrl || "/placeholder.svg"}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Sin fondo</p>
                        {!isPaid && <Badge variant="secondary">Con marca de agua</Badge>}
                      </div>
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <img
                          src={processedImage.watermarkedUrl || "/placeholder.svg"}
                          alt="Sin fondo"
                          className="relative w-full h-full object-cover"
                        />
                        {!isPaid && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/20 text-white px-4 py-2 rounded-lg font-semibold text-lg">
                              WATERMARK
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Options */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Opciones de descarga</h3>

                  {!isPaid ? (
                    <div className="space-y-4">
                      {/* Free Download */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Descarga gratuita</h4>
                          <p className="text-sm text-gray-600">Con marca de agua</p>
                        </div>
                        <Button onClick={downloadWithWatermark} variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar gratis
                        </Button>
                      </div>

                      <Separator />

                      {/* Premium Download */}
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                        <div>
                          <h4 className="font-medium">Descarga premium</h4>
                          <p className="text-sm text-gray-600">Sin marca de agua, alta calidad</p>
                          <p className="text-lg font-bold text-blue-600 mt-1">$2.99</p>
                        </div>
                        <Button onClick={handlePayment} className="bg-gradient-to-r from-blue-600 to-purple-600">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Comprar ahora
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-green-900 mb-2">¡Pago confirmado!</h4>
                      <p className="text-green-700 mb-4">
                        Ya puedes descargar tu imagen en alta calidad sin marca de agua
                      </p>
                      <Button onClick={downloadHD} className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar HD sin marca
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t">
                    <Button onClick={resetFlow} variant="ghost" className="w-full">
                      Procesar otra imagen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 BgRemover. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
