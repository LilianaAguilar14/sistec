"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";

interface Category {
  id_categoria: string;
  nombre: string;
}

interface NewTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

export default function NewTicketModal({
  open,
  onOpenChange,
  onTicketCreated,
}: NewTicketModalProps) {
  // Inicializamos 'categoria' como cadena para el select.
  const [ticketForm, setTicketForm] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "Media",
    categoria: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const id = localStorage.getItem("id") || "0";

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://localhost:7232/api/Categoria");
      if (!response.ok) {
        throw new Error("Error al obtener las categorías");
      }
      const data = await response.json();
      // Forzamos que id_categoria sea cadena
      const cats = data.map((cat: any) => ({
        ...cat,
        id_categoria: String(cat.id_categoria),
      }));
      setCategories(cats);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrioridadChange = (value: string) => {
    setTicketForm((prev) => ({ ...prev, prioridad: value }));
  };

  const handleCategoryChange = (value: string) => {
    // Guardamos el valor como cadena
    setTicketForm((prev) => ({ ...prev, categoria: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoTicket = {
      ...ticketForm,
      id_categoria: Number(ticketForm.categoria),
      estado: "Pendiente",
      idUsuarioCliente: id,
      idUsuarioAgente: 0,
    };

    try {
      const res = await fetch("https://localhost:7232/api/Ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTicket),
      });

      if (res.ok) {
        setTicketForm({
          titulo: "",
          descripcion: "",
          prioridad: "Media",
          categoria: "",
        });
        onTicketCreated();
        onOpenChange(false);
      } else {
        alert("Error al crear el ticket");
      }
    } catch (err) {
      console.error("Error de red", err);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="max-w-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              name="titulo"
              placeholder="Título del ticket"
              value={ticketForm.titulo}
              onChange={handleChange}
              required
            />
            <Textarea
              name="descripcion"
              placeholder="Descripción del problema"
              value={ticketForm.descripcion}
              onChange={handleChange}
              required
            />
            {/* Select para categoría */}
            <Select
              value={ticketForm.categoria}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue className="text-black" placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id_categoria}
                    value={cat.id_categoria}
                    className="text-black"
                  >
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={ticketForm.prioridad}
              onValueChange={handlePrioridadChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Crear Ticket
            </Button>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
