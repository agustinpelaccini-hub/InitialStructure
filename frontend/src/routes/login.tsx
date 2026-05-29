import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole, type Role } from "@/lib/role-context";
import { setAuthToken, api } from "@/lib/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useRole();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Register state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNombre, setRegNombre] = useState("");
  const [regRole, setRegRole] = useState<"cliente" | "repartidor" | "restaurante">("cliente");
  const [regDireccion, setRegDireccion] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regCategoria, setRegCategoria] = useState("");
  const [regVehiculo, setRegVehiculo] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const { data } = await api.post("/auth/login", { email: loginEmail, password: loginPassword });
      
      setAuthToken(data.token);
      login({ 
        rol: data.role as Role, 
        entidad_id: data.entidad_id, 
        nombre: data.nombre 
      });
      
      if (data.role === "repartidor") {
        navigate({ to: "/mis-entregas" });
      } else if (data.role === "restaurante") {
        navigate({ to: `/restaurantes/${data.entidad_id}/panel` });
      } else if (data.role === "cliente") {
        navigate({ to: `/clientes/${data.entidad_id}` });
      } else {
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");

    try {
      const payload: any = {
        email: regEmail,
        password: regPassword,
        nombre: regNombre,
        role: regRole,
      };
      
      if (regRole === "cliente") {
        payload.direccion = regDireccion;
        payload.telefono = regTelefono;
      } else if (regRole === "repartidor") {
        payload.vehiculo = regVehiculo;
      } else if (regRole === "restaurante") {
        payload.categoria = regCategoria;
        payload.direccion = regDireccion;
      }
      
      const { data } = await api.post("/auth/register", payload);
      
      setAuthToken(data.token);
      login({ 
        rol: data.role as Role, 
        entidad_id: data.entidad_id, 
        nombre: data.nombre 
      });
      
      if (data.role === "repartidor") {
        navigate({ to: "/mis-entregas" });
      } else if (data.role === "restaurante") {
        navigate({ to: `/restaurantes/${data.entidad_id}/panel` });
      } else if (data.role === "cliente") {
        navigate({ to: `/clientes/${data.entidad_id}` });
      }
    } catch (err: any) {
      setRegError(err.response?.data?.detail || "Error al crear cuenta");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary items-center justify-center text-primary-foreground font-black text-2xl mb-4">R</div>
          <h1 className="text-3xl font-black">Rappi</h1>
          <p className="text-muted-foreground mt-1">Iniciá sesión o creá tu cuenta</p>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMode("login")}
          >
            Iniciar sesión
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setMode("register")}
          >
            Crear cuenta
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                    {loginError}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Iniciando sesión..." : "Ingresar"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-nombre">Nombre</Label>
                  <Input
                    id="reg-nombre"
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-role">Soy</Label>
                  <select
                    id="reg-role"
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="repartidor">Repartidor</option>
                    <option value="restaurante">Restaurante</option>
                  </select>
                </div>
                
                {regRole === "cliente" && (
                  <>
                    <div>
                      <Label htmlFor="reg-direccion">Dirección</Label>
                      <Input
                        id="reg-direccion"
                        value={regDireccion}
                        onChange={(e) => setRegDireccion(e.target.value)}
                        placeholder="Calle y número"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-telefono">Teléfono</Label>
                      <Input
                        id="reg-telefono"
                        value={regTelefono}
                        onChange={(e) => setRegTelefono(e.target.value)}
                        placeholder="Tu teléfono"
                        required
                      />
                    </div>
                  </>
                )}
                
                {regRole === "repartidor" && (
                  <div>
                    <Label htmlFor="reg-vehiculo">Vehículo</Label>
                    <Input
                      id="reg-vehiculo"
                      value={regVehiculo}
                      onChange={(e) => setRegVehiculo(e.target.value)}
                      placeholder="Moto, bici, etc."
                      required
                    />
                  </div>
                )}
                
                {regRole === "restaurante" && (
                  <>
                    <div>
                      <Label htmlFor="reg-categoria">Categoría</Label>
                      <Input
                        id="reg-categoria"
                        value={regCategoria}
                        onChange={(e) => setRegCategoria(e.target.value)}
                        placeholder="Pizza, sushi, etc."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-direccion">Dirección</Label>
                      <Input
                        id="reg-direccion"
                        value={regDireccion}
                        onChange={(e) => setRegDireccion(e.target.value)}
                        placeholder="Calle y número"
                        required
                      />
                    </div>
                  </>
                )}
                
                {regError && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                    {regError}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={regLoading}>
                  {regLoading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
