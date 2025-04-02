"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  History,
  BarChart3,
  Ticket,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rol, setRol] = useState<string | null>(null)

  useEffect(() => {
    const storedRol = localStorage.getItem("rol")
    if (storedRol) {
      setRol(storedRol.toUpperCase())
    }
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    //{ name: "Agentes", href: "/dashboard/agents", icon: Users },
    { name: "Historial", href: "/dashboard/history", icon: History },
    { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Configuraciones", href: "/dashboard/cliente", icon: Settings },
    { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const filteredNavigation = navigation.filter((item) => {
    if (rol === "ADMIN") return true
    if (rol === "AGENTE") return ["Dashboard", "Historial", "Tickets"].includes(item.name)
    if (rol === "CLIENTE") return ["Dashboard", "Historial"].includes(item.name)
    return false
  })

  return (
    <div className="flex h-screen bg-gray-100">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="fixed top-4 left-4 z-50">
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      )}

      <div
        className={`${
          isMobile
            ? sidebarOpen
              ? "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out"
              : "fixed inset-y-0 left-0 z-40 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out"
            : "w-64"
        } bg-white shadow-lg`}
      >
        <div className="flex h-16 items-center justify-center bg-purple-600">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-white mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
            <h1 className="text-xl font-bold text-white">SISTEC</h1>
          </div>
        </div>
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                    isActive ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={isMobile ? toggleSidebar : undefined}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <Link
              href="/login"
              className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-400" />
              Cerrar Sesión
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {filteredNavigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name ||
              "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">{rol || "Usuario"}</span>
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  {(rol || "U").substring(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
