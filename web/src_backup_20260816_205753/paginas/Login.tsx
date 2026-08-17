import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { useAuth } from '../contexto/AuthContext';

export function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

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
      <div className="login__grid" />
      <div className="login__ambient login__ambient--red" />
      <div className="login__ambient login__ambient--cyan" />

      <aside className="login__story">
        <div className="login__reactor" aria-hidden="true">
          <span />
          <span />
          <i />
        </div>
        <p className="micro-label">STARK SECURE NETWORK</p>
        <h1>Control central de héroes y operaciones.</h1>
        <p>
          Acceso autenticado al sistema Marvel para monitorear perfiles, niveles de poder y misiones activas.
        </p>
        <div className="login__telemetry">
          <span>API STATUS <strong>ONLINE</strong></span>
          <span>AUTH <strong>JWT</strong></span>
          <span>CHANNEL <strong>SECURE</strong></span>
        </div>
      </aside>

      <form className="login__caja" onSubmit={enviar}>
        <div className="login__brand">
          <span className="login__marvel">MARVEL</span>
          <span>HERO CONTROL SYSTEM</span>
        </div>

        <div>
          <p className="micro-label">OPERATOR AUTHENTICATION</p>
          <h2>Acceso al sistema</h2>
          <p className="login__sub">Ingrese sus credenciales para continuar.</p>
        </div>

        {error && <div className="alerta alerta--error">{error}</div>}

        <label className="campo">
          <span>EMAIL / IDENTIFICADOR</span>
          <input
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            placeholder="admin@marvel.com"
            required
          />
        </label>

        <label className="campo">
          <span>CLAVE DE ACCESO</span>
          <input
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
          />
        </label>

        <button className="button button--primary button--wide" type="submit" disabled={enviando}>
          {enviando ? 'Autenticando...' : 'Iniciar sesión'}
        </button>

        <div className="login__ayuda">
          <p>ACCESOS DE DEMOSTRACIÓN</p>
          <button type="button" onClick={() => completar('admin@marvel.com', 'Admin1234')}>
            <span>ADMIN</span> admin@marvel.com
          </button>
          <button type="button" onClick={() => completar('consulta@marvel.com', 'Consulta1234')}>
            <span>CONSULTA</span> consulta@marvel.com
          </button>
        </div>
      </form>
    </div>
  );
}
