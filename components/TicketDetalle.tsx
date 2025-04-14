"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TicketDetalleProps {
  ticket: any;
  open: boolean;
  onClose: () => void;
}

interface CommentType {
  id: number;
  contenido: string;
  usuario: {
    idUsuario: number;
    nombre: string;
    apellido: string;
  };
  fecha: string;
}

export default function TicketDetalle({ ticket, open, onClose }: TicketDetalleProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Función para cargar comentarios del ticket
  const loadComments = async () => {
    if (!ticket) return;
    setLoadingComments(true);
    try {
      const res = await fetch(`https://localhost:7232/api/Comentario/ticket/${ticket.idTicket}`);
      if (!res.ok) throw new Error("Error al obtener comentarios");
      const data = await res.json();
      setComments(data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (ticket) {
      loadComments();
    }
  }, [ticket]);

  // Función para agregar comentario usando la estructura requerida en el body:
  // { "contenido": "string", "idTicket": 0, "idUsuario": 0 }
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || newComment.trim() === "") return;
    try {
      const idUsuario = Number(localStorage.getItem("id")) || 0;
      const res = await fetch(`https://localhost:7232/api/Comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: newComment,
          idTicket: Number(ticket.idTicket),
          idUsuario: idUsuario,
        }),
      });
      if (!res.ok) throw new Error("Error al agregar comentario");
      setNewComment("");
      loadComments();
    } catch (error: any) {
      console.error(error.message);
      alert("Error al agregar comentario");
    }
  };

  if (!ticket) return null;

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
        {/* Sección de Comentarios */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Comentarios</h3>
          {loadingComments ? (
            <p>Cargando comentarios...</p>
          ) : (
            <div className="space-y-2">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">No hay comentarios.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border p-2 rounded">
                    <p>{comment.contenido}</p>
                    <small className="text-gray-500">
                      {comment.usuario.nombre} {comment.usuario.apellido} - {new Date(comment.fecha).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
          <form onSubmit={handleAddComment} className="mt-4 space-y-2">
            <Textarea
              placeholder="Agrega un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Agregar Comentario
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "En Proceso":
      return "bg-blue-100 text-blue-800";
    case "Resuelto":
      return "bg-green-100 text-green-800";
    case "Cancelado":
      return "bg-red-100 text-red-800";
    case "Asignado":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPrioridadColor = (prioridad: string) => {
  switch (prioridad) {
    case "Alta":
      return "bg-red-100 text-red-800";
    case "Media":
      return "bg-yellow-100 text-yellow-800";
    case "Baja":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
