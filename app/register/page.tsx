"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    clave: "",
    confirmarClave: "",
    rol: "CLIENTE",
  })

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRolChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rol: value.toUpperCase() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.clave !== formData.confirmarClave) {
      alert("Las contraseñas no coinciden.")
      return
    }

    try {
      const response = await fetch("https://localhost:7232/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          clave: formData.clave,
          rol: formData.rol,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Usuario registrado:", data)
        alert("Usuario registrado con éxito.")
        router.push("/login")
      } else {
        const error = await response.json()
        console.error("Error al registrar:", error)
        alert(error.message || "No se pudo registrar el usuario.")
      }
    } catch (error) {
      console.error("Error de red:", error)
      alert("Error de red o servidor.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-purple-600 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Registro SISTEC</CardTitle>
          <p className="text-sm text-gray-500">
            Crea una cuenta para acceder al sistema
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Input
                name="correo"
                type="email"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="clave"
                type="password"
                placeholder="Contraseña"
                value={formData.clave}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                name="confirmarClave"
                type="password"
                placeholder="Confirmar contraseña"
                value={formData.confirmarClave}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Select value={formData.rol} onValueChange={handleRolChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="AGENTE">Técnico</SelectItem>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Registrarse
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-purple-600 hover:underline">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
