"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function SettingsPage() {
  const [notificationsEmail, setNotificationsEmail] = useState(true)
  const [notificationsSystem, setNotificationsSystem] = useState(true)
  const [autoAssign, setAutoAssign] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>Configura los ajustes generales del sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de la Empresa</Label>
                  <Input id="company-name" defaultValue="SISTEC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Correo de Soporte</Label>
                  <Input id="support-email" type="email" defaultValue="soporte@sistec.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america-central">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-central">América Central (UTC-6)</SelectItem>
                      <SelectItem value="america-este">América del Este (UTC-5)</SelectItem>
                      <SelectItem value="america-oeste">América del Oeste (UTC-8)</SelectItem>
                      <SelectItem value="europa-central">Europa Central (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-assign" checked={autoAssign} onCheckedChange={setAutoAssign} />
                  <Label htmlFor="auto-assign">Asignación automática de tickets</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-purple-600 hover:bg-purple-700">Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notificaciones">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>Configura cómo y cuándo recibir notificaciones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="font-medium">
                        Notificaciones por Correo
                      </Label>
                      <p className="text-sm text-gray-500">Recibe actualizaciones por correo electrónico</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationsEmail}
                      onCheckedChange={setNotificationsEmail}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-notifications" className="font-medium">
                        Notificaciones del Sistema
                      </Label>
                      <p className="text-sm text-gray-500">Recibe notificaciones dentro del sistema</p>
                    </div>
                    <Switch
                      id="system-notifications"
                      checked={notificationsSystem}
                      onCheckedChange={setNotificationsSystem}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-events">Eventos para Notificar</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="new-ticket" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="new-ticket">Nuevo ticket creado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="status-change" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="status-change">Cambio de estado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="comment-added" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="comment-added">Nuevo comentario</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="ticket-assigned" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="ticket-assigned">Ticket asignado</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-purple-600 hover:bg-purple-700">Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categorias">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Categorías</CardTitle>
                <CardDescription>Administra las categorías para clasificar los tickets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-category">Nueva Categoría</Label>
                  <div className="flex gap-2">
                    <Input id="new-category" placeholder="Nombre de la categoría" />
                    <Button className="bg-purple-600 hover:bg-purple-700">Agregar</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categorías Existentes</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {["Hardware", "Software", "Red", "Sistema"].map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{category}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cuenta">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>Actualiza tu información personal y credenciales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Nombre</Label>
                    <Input id="account-name" defaultValue="Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-lastname">Apellido</Label>
                    <Input id="account-lastname" defaultValue="Usuario" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-email">Correo Electrónico</Label>
                  <Input id="account-email" type="email" defaultValue="admin@sistec.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">Actualizar Cuenta</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

