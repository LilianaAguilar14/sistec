"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AgentsPage() {
  // Datos de ejemplo
  const agents = [
    {
      id: 1,
      nombre: "Carlos Rodríguez",
      correo: "carlos@sistec.com",
      telefono: "123-456-7890",
      especialidad: "Hardware",
      ticketsAsignados: 12,
      ticketsResueltos: 45,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Ana Martínez",
      correo: "ana@sistec.com",
      telefono: "123-456-7891",
      especialidad: "Software",
      ticketsAsignados: 8,
      ticketsResueltos: 37,
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Luis Gómez",
      correo: "luis@sistec.com",
      telefono: "123-456-7892",
      especialidad: "Red",
      ticketsAsignados: 5,
      ticketsResueltos: 28,
      estado: "Inactivo",
    },
    {
      id: 4,
      nombre: "Elena Torres",
      correo: "elena@sistec.com",
      telefono: "123-456-7893",
      especialidad: "Sistema",
      ticketsAsignados: 10,
      ticketsResueltos: 52,
      estado: "Activo",
    },
    {
      id: 5,
      nombre: "Roberto Sánchez",
      correo: "roberto@sistec.com",
      telefono: "123-456-7894",
      especialidad: "Hardware",
      ticketsAsignados: 7,
      ticketsResueltos: 31,
      estado: "Activo",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800"
      case "Inactivo":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Agentes Técnicos</h2>
        <div className="mt-2 sm:mt-0">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Agente
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Gestión de Agentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar por nombre, correo o especialidad..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Tickets Asignados</TableHead>
                  <TableHead>Tickets Resueltos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${getInitials(agent.nombre)}`} />
                          <AvatarFallback>{getInitials(agent.nombre)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.nombre}</p>
                          <p className="text-xs text-gray-500">ID: {agent.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{agent.correo}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span className="text-sm">{agent.telefono}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{agent.especialidad}</TableCell>
                    <TableCell>{agent.ticketsAsignados}</TableCell>
                    <TableCell>{agent.ticketsResueltos}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(agent.estado)}>{agent.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

