"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HistoryPage() {
  const [filterTicket, setFilterTicket] = useState("todos")
  const [historyEntries, setHistoryEntries] = useState<any[]>([])

  useEffect(() => {
    fetch("https://localhost:7232/api/Ticket/History")
      .then(res => res.json())
      .then(setHistoryEntries)
      .catch(() => console.error("Error al cargar historial de tickets"))
  }, [])

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
    filterTicket === "todos" ? historyEntries : historyEntries.filter((entry) => entry.id_ticket.toString() === filterTicket)

  const uniqueTickets = [...new Set(historyEntries.map((entry) => `TK-${entry.id_ticket}`))]

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
                  {[...new Set(historyEntries.map((e) => e.id_ticket))].map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      TK-{id}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry) => (
                  <TableRow key={entry.id_historial}>
                    <TableCell className="font-medium">{entry.id_historial}</TableCell>
                    <TableCell>TK-{entry.id_ticket}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.estado_anterior)}>{entry.estado_anterior}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.estado_nuevo)}>{entry.estado_nuevo}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span>{new Date(entry.fecha_cambio).toLocaleString()}</span>
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
