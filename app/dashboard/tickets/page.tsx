"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Plus } from "lucide-react"
import TicketDetalle from "@/components/TicketDetalle"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState("todos")
  const [filterPriority, setFilterPriority] = useState("todas")
  const [filterCategory, setFilterCategory] = useState("todas")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    fetch("https://localhost:7232/api/Ticket")
      .then((res) => res.json())
      .then(setTickets)
      .catch((err) => console.error("Error al obtener tickets", err))
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleVerTicket = async (id: number) => {
    try {
      const res = await fetch(`https://localhost:7232/api/Ticket/${id}`)
      const data = await res.json()
      setSelectedTicket(data)
      setOpenModal(true)
    } catch (err) {
      console.error("Error al cargar ticket", err)
    }
  }

  const handleEditTicket = async (id: number) => {
    const res = await fetch(`https://localhost:7232/api/Ticket/${id}`)
  }

  const filteredTickets = tickets.filter((ticket) => {
    return (
      (filterStatus === "todos" || ticket.estado === filterStatus) &&
      (filterPriority === "todas" || ticket.prioridad === filterPriority) &&
      (filterCategory === "todas" || ticket.categoria === filterCategory)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        <div className="mt-2 sm:mt-0">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Gestión de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar por título, cliente o ID..." className="pl-8" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Filtros:</span>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Resuelto">Resuelto</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Hardware">Hardware</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Sistema">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.idTicket}>
                    <TableCell className="font-medium">TK-{ticket.idTicket}</TableCell>
                    <TableCell>{ticket.titulo}</TableCell>
                    <TableCell>{ticket.usuarioCliente?.nombre} {ticket.usuarioCliente?.apellido}</TableCell>
                    <TableCell>{ticket.categoria}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.prioridad)}>{ticket.prioridad}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.estado)}>{ticket.estado}</Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.fechaCreacion).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleVerTicket(ticket.idTicket)}>
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => }>
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

      <TicketDetalle
        ticket={selectedTicket}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  )
}
