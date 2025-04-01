"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface TicketDetalleProps {
  ticket: any
  open: boolean
  onClose: () => void
}

export default function TicketDetalle({ ticket, open, onClose }: TicketDetalleProps) {
  if (!ticket) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalles del Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p><strong>ID:</strong> TK-{ticket.idTicket}</p>
          <p><strong>Título:</strong> {ticket.titulo}</p>
          <p><strong>Descripción:</strong> {ticket.descripcion}</p>
          <p><strong>Estado:</strong> <Badge>{ticket.estado}</Badge></p>
          <p><strong>Prioridad:</strong> <Badge>{ticket.prioridad}</Badge></p>
          <p><strong>Fecha de Creación:</strong> {new Date(ticket.fechaCreacion).toLocaleDateString()}</p>
          {ticket.fechaResolucion && <p><strong>Resuelto el:</strong> {new Date(ticket.fechaResolucion).toLocaleDateString()}</p>}
          <p><strong>Cliente:</strong> {ticket.usuarioCliente?.nombre} {ticket.usuarioCliente?.apellido} ({ticket.usuarioCliente?.correo})</p>
          {ticket.usuarioAgente &&
            <p><strong>Agente Asignado:</strong> {ticket.usuarioAgente?.nombre} {ticket.usuarioAgente?.apellido} ({ticket.usuarioAgente?.correo})</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
