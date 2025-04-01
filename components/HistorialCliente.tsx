// components/HistorialCliente.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function HistorialCliente({ usuario }: { usuario: any }) {
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    fetch("https://localhost:7232/api/Ticket")
      .then((res) => res.json())
      .then((data) => {
        const propios = data.filter((t: any) => t.idUsuarioCliente === usuario.id)
        setTickets(propios)
      })
  }, [usuario])

  const getColor = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-yellow-100 text-yellow-800"
      case "En Proceso": return "bg-blue-100 text-blue-800"
      case "Resuelto": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Historial de Tickets</CardTitle></CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.idTicket}>
                  <TableCell>TK-{ticket.idTicket}</TableCell>
                  <TableCell>{ticket.titulo}</TableCell>
                  <TableCell>{ticket.categoria}</TableCell>
                  <TableCell><Badge className={getColor(ticket.estado)}>{ticket.estado}</Badge></TableCell>
                  <TableCell>{new Date(ticket.fechaCreacion).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
