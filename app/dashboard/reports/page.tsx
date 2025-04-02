"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Interfaces de datos
interface Ticket {
  idTicket: string;
  titulo: string;
  usuarioCliente: {
    idUsuario: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
  fechaCreacion: string;
  fechaResolucion?: string;
  estado: string;
  categoria: {
    id_categoria: string;
    nombre: string;
  };
  prioridad: string;
  tiempoResolucion?: number;
}

interface Category {
  id_categoria: string;
  nombre: string;
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("mes");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Referencia para exportar a PDF (envolvemos el contenido de reportes)
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("https://localhost:7232/api/Ticket");
        if (!res.ok) throw new Error("Error al obtener tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://localhost:7232/api/Categoria");
        if (!res.ok) throw new Error("Error al obtener categorías");
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchTickets();
    fetchCategories();
  }, [timeRange]);

  // Tickets por estado
  const statuses = ["Pendiente", "En Proceso", "Resuelto", "Cancelado"];
  const ticketsByStatus = statuses.map((status) => ({
    name: status,
    value: tickets.filter((t) => t.estado === status).length,
  }));

  // Tickets por categoría
  const ticketsByCategory = categories.map((cat) => {
    const count = tickets.filter(
      (t) => t.categoria?.id_categoria === cat.id_categoria
    ).length;
    return { name: cat.nombre, value: count };
  });

  // Tickets por mes: agrupamos según la fechaCreacion
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const ticketsByMonthMap: { [key: string]: { pendientes: number; resueltos: number } } = {};
  tickets.forEach((ticket) => {
    const date = new Date(ticket.fechaCreacion);
    if (isNaN(date.getTime())) return;
    const month = monthNames[date.getMonth()];
    if (!ticketsByMonthMap[month]) {
      ticketsByMonthMap[month] = { pendientes: 0, resueltos: 0 };
    }
    if (ticket.estado === "Pendiente") {
      ticketsByMonthMap[month].pendientes += 1;
    } else if (ticket.estado === "Resuelto") {
      ticketsByMonthMap[month].resueltos += 1;
    }
  });
  const ticketsByMonth = Object.entries(ticketsByMonthMap)
    .map(([month, data]) => ({ name: month, ...data }))
    .sort((a, b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name));

  // Tiempo Promedio de Resolución por Categoría: calculamos la diferencia en horas entre fechaCreacion y fechaResolucion para cada ticket resuelto
  const resolutionTime = categories.map((cat) => {
    const resolvedTickets = tickets.filter(
      (t) =>
        t.estado === "Resuelto" &&
        t.categoria?.id_categoria === cat.id_categoria &&
        t.fechaCreacion &&
        t.fechaResolucion
    );
    const totalHours = resolvedTickets.reduce((sum, ticket) => {
      const creacion = new Date(ticket.fechaCreacion);
      const resolucion = new Date(ticket.fechaResolucion!);
      const diffHours = (resolucion.getTime() - creacion.getTime()) / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);
    const avgTime = resolvedTickets.length > 0 ? totalHours / resolvedTickets.length : 0;
    return { name: cat.nombre, tiempo: Number(avgTime.toFixed(1)) };
  });

  // Agent performance (estático en este ejemplo)
  const agentPerformance = [
    { name: "Carlos R.", resueltos: 45, tiempo: 20 },
    { name: "Ana M.", resueltos: 37, tiempo: 18 },
    { name: "Luis G.", resueltos: 28, tiempo: 24 },
    { name: "Elena T.", resueltos: 52, tiempo: 16 },
    { name: "Roberto S.", resueltos: 31, tiempo: 22 },
  ];

  // Colores para los gráficos
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];

  // Función para exportar a PDF
  const exportToPDF = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("reportes.pdf");
    }
  };

  // Función para exportar a Excel (ejemplo exportando los tickets por estado)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ticketsByStatus);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TicketsPorEstado");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "reportes.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Botones para exportar */}
      <div className="flex justify-end gap-4">
        <button onClick={exportToPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Exportar a PDF
        </button>
        <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Exportar a Excel
        </button>
      </div>

      {/* Encabezado y selector de período */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reportes y Estadísticas</h2>
        <div className="mt-2 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periodo de tiempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Última semana</SelectItem>
              <SelectItem value="mes">Último mes</SelectItem>
              <SelectItem value="trimestre">Último trimestre</SelectItem>
              <SelectItem value="anio">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contenedor de reportes (referenciado para exportar a PDF) */}
      <div ref={reportRef}>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="categorias">Por Categorías</TabsTrigger>
            <TabsTrigger value="agentes">Desempeño de Agentes</TabsTrigger>
          </TabsList>

          {/* Reporte General */}
          <TabsContent value="general">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketsByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ticketsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketsByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ticketsByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Tendencia de Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={ticketsByMonth}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pendientes" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="resueltos" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reporte por Categorías */}
          <TabsContent value="categorias">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Tiempo Promedio de Resolución por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={resolutionTime}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: "Horas", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tiempo" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reporte de Desempeño de Agentes */}
          <TabsContent value="agentes">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Desempeño de Agentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentPerformance}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="resueltos" fill="#8884d8" name="Tickets Resueltos" />
                        <Bar dataKey="tiempo" fill="#82ca9d" name="Tiempo Promedio (horas)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
