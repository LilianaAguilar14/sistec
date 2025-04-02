"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

interface TicketDetalleProps {
  ticket: any
  open: boolean
  onClose: () => void
}

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800"
    case "En Proceso":
      return "bg-blue-100 text-blue-800"
    case "Resuelto":
      return "bg-green-100 text-green-800"
    case "Cancelado":
      return "bg-red-100 text-red-800"
    case "Asignado":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPrioridadColor = (prioridad: string) => {
  switch (prioridad) {
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

export default function TicketDetalle({ ticket, open, onClose }: TicketDetalleProps) {
  if (!ticket) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalles del Ticket</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs mb-1">ID</p>
            <p className="font-medium">TK-{ticket.idTicket}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Título</p>
            <p className="font-medium">{ticket.titulo}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground text-xs mb-1">Descripción</p>
            <p className="font-medium">{ticket.descripcion}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Estado</p>
            <Badge className={clsx(getEstadoColor(ticket.estado))}>{ticket.estado}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Prioridad</p>
            <Badge className={clsx(getPrioridadColor(ticket.prioridad))}>{ticket.prioridad}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Creado</p>
            <p className="font-medium">{new Date(ticket.fechaCreacion).toLocaleDateString()}</p>
          </div>
          {ticket.fechaResolucion && (
            <div>
              <p className="text-muted-foreground text-xs mb-1">Resuelto el</p>
              <p className="font-medium">{new Date(ticket.fechaResolucion).toLocaleDateString()}</p>
            </div>
          )}
          <div className="sm:col-span-2">
            <p className="text-muted-foreground text-xs mb-1">Cliente</p>
            <p className="font-medium">
              {ticket.usuarioCliente?.nombre} {ticket.usuarioCliente?.apellido} ({ticket.usuarioCliente?.correo})
            </p>
          </div>
          {ticket.usuarioAgente && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-xs mb-1">Agente Asignado</p>
              <p className="font-medium">
                {ticket.usuarioAgente?.nombre} {ticket.usuarioAgente?.apellido} ({ticket.usuarioAgente?.correo})
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
