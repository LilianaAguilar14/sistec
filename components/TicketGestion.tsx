"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface TicketEditarProps {
  ticket: any
  open: boolean
  onClose: () => void
  onUpdated?: () => void
}

export default function TicketGestion({ ticket, open, onClose, onUpdated }: TicketEditarProps) {
  const [estado, setEstado] = useState("")
  const [agenteId, setAgenteId] = useState("")
  const [agentes, setAgentes] = useState<any[]>([])

  useEffect(() => {
    if (ticket) {
      setEstado(ticket.estado)
      setAgenteId(ticket.usuarioAgente?.idUsuario?.toString() || "")
    }
  }, [ticket])

  useEffect(() => {
    fetch("https://localhost:7232/api/User/role/AGENTE")
      .then((res) => res.json())
      .then(setAgentes)
      .catch(() => toast.error("Error al cargar agentes"))
  }, [])

  const handleGuardar = async () => {
    try {
      // 1. Actualizar estado si ha cambiado
      if (estado && estado !== ticket.estado) {
        const estadoResponse = await fetch(`https://localhost:7232/api/Ticket/${ticket.idTicket}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(estado),
        })

        if (!estadoResponse.ok) throw new Error("Error al actualizar el estado")
      }

      // 2. Asignar agente si no hay ninguno asignado aún
      const yaTieneAgente = !!ticket.usuarioAgente
      const agenteActual = ticket.usuarioAgente?.idUsuario?.toString() || ""

      if (!yaTieneAgente && agenteId && agenteId !== agenteActual) {
        const asignarResponse = await fetch(`https://localhost:7232/api/Ticket/${ticket.idTicket}/assign`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parseInt(agenteId)),
        })

        if (!asignarResponse.ok) throw new Error("Error al asignar agente")
      }

      toast.success("Ticket actualizado correctamente")
      onClose()
      onUpdated?.()
    } catch (err) {
      console.error(err)
      toast.error("Error al guardar los cambios")
    }
  }

  if (!ticket) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p><strong>ID:</strong> TK-{ticket.idTicket}</p>
          <p><strong>Título:</strong> {ticket.titulo}</p>
          <p><strong>Descripción:</strong> {ticket.descripcion}</p>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Asignado">Asignado</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Resuelto">Resuelto</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agente Asignado</label>
            <Select
              value={agenteId}
              onValueChange={setAgenteId}
              disabled={!!ticket.usuarioAgente} // deshabilita si ya tiene agente
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar agente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {agentes.map((agente) => (
                  <SelectItem key={agente.idUsuario} value={agente.idUsuario.toString()}>
                    {agente.nombre} {agente.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!!ticket.usuarioAgente && (
              <p className="text-xs text-gray-500 mt-1">
                Este ticket ya tiene un agente asignado y no puede ser reasignado.
              </p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button onClick={handleGuardar} className="bg-purple-600 hover:bg-purple-700">
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
