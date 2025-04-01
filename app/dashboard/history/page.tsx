"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function HistoryPage() {
  const [filterTicket, setFilterTicket] = useState("todos")

  // Datos de ejemplo
  const historyEntries = [
    {
      id: 1,
      ticketId: "TK-1234",
      estadoAnterior: "Pendiente",
      estadoNuevo: "En Proceso",
      fecha: "2023-06-15 10:30",
      usuario: "Carlos Rodríguez",
      comentario: "Asignado a técnico para revisión",
    },
    {
      id: 2,
      ticketId: "TK-1235",
      estadoAnterior: "Pendiente",
      estadoNuevo: "En Proceso",
      fecha: "2023-06-15 11:45",
      usuario: "Ana Martínez",
      comentario: "Iniciando diagnóstico del problema",
    },
    {
      id: 3,
      ticketId: "TK-1236",
      estadoAnterior: "En Proceso",
      estadoNuevo: "Resuelto",
      fecha: "2023-06-14 14:20",
      usuario: "Luis Gómez",
      comentario: "Actualización completada con éxito",
    },
    {
      id: 4,
      ticketId: "TK-1234",
      estadoAnterior: "En Proceso",
      estadoNuevo: "Resuelto",
      fecha: "2023-06-16 09:15",
      usuario: "Carlos Rodríguez",
      comentario: "Se reemplazó el cable de alimentación defectuoso",
    },
    {
      id: 5,
      ticketId: "TK-1237",
      estadoAnterior: "Pendiente",
      estadoNuevo: "En Proceso",
      fecha: "2023-06-14 16:30",
      usuario: "Elena Torres",
      comentario: "Revisando compatibilidad de cartuchos",
    },
    {
      id: 6,
      ticketId: "TK-1238",
      estadoAnterior: "Pendiente",
      estadoNuevo: "En Proceso",
      fecha: "2023-06-13 13:45",
      usuario: "Roberto Sánchez",
      comentario: "Verificando configuración del router",
    },
    {
      id: 7,
      ticketId: "TK-1239",
      estadoAnterior: "En Proceso",
      estadoNuevo: "Resuelto",
      fecha: "2023-06-13 17:20",
      usuario: "Ana Martínez",
      comentario: "Configuración de SMTP corregida",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "En Proceso":
        return "bg-blue-100 text-blue-800"
      case "Resuelto":
        return "bg-green-100 text-green-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredHistory =
    filterTicket === "todos" ? historyEntries : historyEntries.filter((entry) => entry.ticketId === filterTicket)

  const uniqueTickets = [...new Set(historyEntries.map((entry) => entry.ticketId))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Historial de Estados</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Registro de Cambios de Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar en historial..." className="pl-8" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Filtrar por ticket:</span>
              </div>
              <Select value={filterTicket} onValueChange={setFilterTicket}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar ticket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tickets</SelectItem>
                  {uniqueTickets.map((ticketId) => (
                    <SelectItem key={ticketId} value={ticketId}>
                      {ticketId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Estado Anterior</TableHead>
                  <TableHead>Estado Nuevo</TableHead>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Comentario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.id}</TableCell>
                    <TableCell>{entry.ticketId}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.estadoAnterior)}>{entry.estadoAnterior}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.estadoNuevo)}>{entry.estadoNuevo}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span>{entry.fecha}</span>
                      </div>
                    </TableCell>
                    <TableCell>{entry.usuario}</TableCell>
                    <TableCell>{entry.comentario}</TableCell>
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

