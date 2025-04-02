"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import TicketDetalle from "@/components/TicketDetalle";
import TicketGestion from "@/components/TicketGestion";
import NewTicketModal from "@/components/NewTicketModal"; // Componente modal separado
import { formatDate, isDate, toDate } from "date-fns";

interface Ticket {
  idTicket: string;
  titulo: string;
  usuarioCliente: usuarioCliente;
  fechaCreacion: string;
  estado: string;
  categoria: Categoria;
  prioridad: string;
}

interface usuarioCliente {
  idUsuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
}

interface Categoria {
  id_categoria: string;
  nombre: string;
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    // Obtenemos el rol y el id del localStorage
    const rol = localStorage.getItem("rol");
    let endpoint = "";
    if (rol === "ADMIN" || rol === "AGENTE") {
      endpoint = "https://localhost:7232/api/Ticket";
    } else {
      const id = localStorage.getItem("id");
      endpoint = `https://localhost:7232/api/Ticket/client/${id}`;
    }

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener los tickets");
        }
        return res.json();
      })
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Estadísticas
  const pendingCount = tickets.filter(
    (ticket) => ticket.estado === "Pendiente"
  ).length;
  const inProcessCount = tickets.filter(
    (ticket) => ticket.estado === "En Proceso"
  ).length;
  const cancelledCount = tickets.filter(
    (ticket) =>
      ticket.estado === "Cancelado" || ticket.estado === "Cancelados"
  ).length;
  const resolvedCount = tickets.filter(
    (ticket) => ticket.estado === "Resuelto" || ticket.estado === "Resueltos"
  ).length;

  const stats = [
    {
      title: "Pendientes",
      value: pendingCount,
      change: "0%",
      color: "bg-blue-500",
      icon: Clock,
      textColor: "text-blue-500",
    },
    {
      title: "En Proceso",
      value: inProcessCount,
      change: "0%",
      color: "bg-purple-500",
      icon: CheckCircle,
      textColor: "text-purple-500",
    },
    {
      title: "Cancelados",
      value: cancelledCount,
      change: "0%",
      color: "bg-red-500",
      icon: XCircle,
      textColor: "text-red-500",
    },
    {
      title: "Resueltos",
      value: resolvedCount,
      change: "0%",
      color: "bg-green-500",
      icon: CheckCircle,
      textColor: "text-green-500",
    },
  ];

  const handleVerTicket = async (id: number) => {
    const res = await fetch(`https://localhost:7232/api/Ticket/${id}`)
    const data = await res.json()
    setSelectedTicket(data)
    setViewModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "En Proceso":
        return "bg-blue-100 text-blue-800";
      case "Resuelto":
        return "bg-green-100 text-green-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y botón para abrir el modal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Resumen</h2>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar tickets..."
              className="pl-8 w-[200px] md:w-[300px]"
            />
          </div>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setModalOpen(true)}
          >
            Nuevo Ticket
          </Button>
          {/* Modal reutilizando el componente NewTicketModal */}
          <NewTicketModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            onTicketCreated={() => {
              // Vuelve a cargar los tickets al crear uno nuevo
              window.location.reload();
            }}
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p
                      className={`ml-2 text-xs ${
                        stat.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`${stat.color} p-2 rounded-full`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla de tickets */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tickets Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Aquí se podrían agregar Tabs o filtros según se requiera */}
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
                {tickets.map((ticket) => (
                  <TableRow key={ticket.idTicket}>
                    <TableCell className="font-medium">
                      {ticket.idTicket}
                    </TableCell>
                    <TableCell>{ticket.titulo}</TableCell>
                    <TableCell>{ticket.usuarioCliente.nombre}</TableCell>
                    <TableCell>
                      {ticket.categoria?.nombre || "Sin Categoria"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.prioridad)}>
                        {ticket.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.estado)}>
                        {ticket.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(ticket.fechaCreacion).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={()=>handleVerTicket(Number(ticket.idTicket))}>
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modales para detalle y edición */}
      <TicketDetalle
        ticket={selectedTicket}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
      <TicketGestion
        ticket={selectedTicket}
        open={false}
        onClose={() => {}}
        onUpdated={() => {}}
      />
    </div>
  );
}
