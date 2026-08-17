import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { useAuth } from '../contexto/AuthContext';

export function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  // Formulario controlado: cada input vive en el estado del componente.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesion no tiene sentido mostrar el login.
  if (usuario) return <Navigate to="/heroes" replace />;

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await iniciarSesion(email, password);
      const destino = (ubicacion.state as { desde?: string } | null)?.desde ?? '/heroes';
      navegar(destino, { replace: true });
    } catch (error) {
      setError(mensajeDeError(error));
    } finally {
      setEnviando(false);
    }
  };

  const completar = (correo: string, clave: string) => {
    setEmail(correo);
    setPassword(clave);
  };

  return (
    <div className="login">
      <form className="login__caja" onSubmit={enviar}>
        <h1 className="login__titulo">MARVEL</h1>
        <p className="login__sub">Plataforma de heroes y misiones</p>

        {/* Renderizado condicional del error devuelto por la API. */}
        {error && <div className="alerta alerta--error">{error}</div>}

        <label className="campo">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            placeholder="admin@marvel.com"
            required
          />
        </label>

        <label className="campo">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="Minimo 8 caracteres"
            minLength={8}
            required
          />
        </label>

        <button className="boton boton--primario boton--ancho" type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Iniciar sesion'}
        </button>

        <div className="login__ayuda">
          <p>Usuarios de prueba:</p>
          <button type="button" onClick={() => completar('admin@marvel.com', 'Admin1234')}>
            ADMIN: admin@marvel.com / Admin1234
          </button>
          <button type="button" onClick={() => completar('consulta@marvel.com', 'Consulta1234')}>
            CONSULTA: consulta@marvel.com / Consulta1234
          </button>
        </div>
      </form>
    </div>
  );
}
