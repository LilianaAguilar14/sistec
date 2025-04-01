"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  // Datos de ejemplo
  const stats = [
    {
      title: "Pendientes",
      value: 150,
      change: "+12%",
      color: "bg-blue-500",
      icon: Clock,
      textColor: "text-blue-500",
    },
    {
      title: "En Proceso",
      value: 22,
      change: "+5%",
      color: "bg-purple-500",
      icon: CheckCircle,
      textColor: "text-purple-500",
    },
    {
      title: "Cancelados",
      value: 3,
      change: "-2%",
      color: "bg-red-500",
      icon: XCircle,
      textColor: "text-red-500",
    },
    {
      title: "Resueltos",
      value: 45,
      change: "+15%",
      color: "bg-green-500",
      icon: CheckCircle,
      textColor: "text-green-500",
    },
  ]

  const recentTickets = [
    {
      id: "TK-1234",
      title: "Problema con monitor",
      cliente: "Juan Pérez",
      fecha: "2023-06-15",
      estado: "Pendiente",
      categoria: "Hardware",
      prioridad: "Alta",
    },
    {
      id: "TK-1235",
      title: "Error en software",
      cliente: "María López",
      fecha: "2023-06-15",
      estado: "En Proceso",
      categoria: "Software",
      prioridad: "Media",
    },
    {
      id: "TK-1236",
      title: "Actualización de sistema",
      cliente: "Carlos Gómez",
      fecha: "2023-06-14",
      estado: "Resuelto",
      categoria: "Sistema",
      prioridad: "Baja",
    },
    {
      id: "TK-1237",
      title: "Falla en impresora",
      cliente: "Ana Martínez",
      fecha: "2023-06-14",
      estado: "Pendiente",
      categoria: "Hardware",
      prioridad: "Media",
    },
    {
      id: "TK-1238",
      title: "Problema de red",
      cliente: "Roberto Sánchez",
      fecha: "2023-06-13",
      estado: "En Proceso",
      categoria: "Red",
      prioridad: "Alta",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Resumen</h2>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Buscar tickets..." className="pl-8 w-[200px] md:w-[300px]" />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Nuevo Ticket</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className={`ml-2 text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tickets Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="proceso">En Proceso</TabsTrigger>
              <TabsTrigger value="resueltos">Resueltos</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
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
                    {recentTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.cliente}</TableCell>
                        <TableCell>{ticket.categoria}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(ticket.prioridad)}>{ticket.prioridad}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(ticket.estado)}>{ticket.estado}</Badge>
                        </TableCell>
                        <TableCell>{ticket.fecha}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="pendientes">
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
                    {recentTickets
                      .filter((ticket) => ticket.estado === "Pendiente")
                      .map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.cliente}</TableCell>
                          <TableCell>{ticket.categoria}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(ticket.prioridad)}>{ticket.prioridad}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(ticket.estado)}>{ticket.estado}</Badge>
                          </TableCell>
                          <TableCell>{ticket.fecha}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="proceso">
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
                    {recentTickets
                      .filter((ticket) => ticket.estado === "En Proceso")
                      .map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.cliente}</TableCell>
                          <TableCell>{ticket.categoria}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(ticket.prioridad)}>{ticket.prioridad}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(ticket.estado)}>{ticket.estado}</Badge>
                          </TableCell>
                          <TableCell>{ticket.fecha}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="resueltos">
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
                    {recentTickets
                      .filter((ticket) => ticket.estado === "Resuelto")
                      .map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.cliente}</TableCell>
                          <TableCell>{ticket.categoria}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(ticket.prioridad)}>{ticket.prioridad}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(ticket.estado)}>{ticket.estado}</Badge>
                          </TableCell>
                          <TableCell>{ticket.fecha}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

