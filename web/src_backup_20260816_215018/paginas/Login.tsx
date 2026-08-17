import { useState, type CSSProperties, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { mensajeDeError } from '../api/cliente';
import { useAuth } from '../contexto/AuthContext';
import marvelLogo from '../assets/marvel-logo.png';
import comicTexture from '../assets/marvel-comic-texture.png';

function LoginConstellation() {
  return (
    <div className="login__particles" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          style={
            {
              '--x': `${(index * 13) % 100}%`,
              '--y': `${(index * 29) % 100}%`,
              '--size': `${6 + ((index * 7) % 18)}px`,
              '--delay': `${index * 0.35}s`,
              '--duration': `${7 + (index % 5)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

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
    <div className="login login--v2">
      <div className="login__sky" aria-hidden="true" />
      <div className="login__grid" />
      <div className="login__ambient login__ambient--red" />
      <div className="login__ambient login__ambient--cyan" />
      <div className="login__mist login__mist--violet" aria-hidden="true" />
      <div className="login__mist login__mist--blue" aria-hidden="true" />
      <LoginConstellation />

      <aside className="login__story">
        <div
          className="login__story-logo-frame"
          style={{ backgroundImage: `linear-gradient(rgba(230,36,41,.88), rgba(134,8,17,.82)), url(${comicTexture})` }}
        >
          <div className="login__story-logo-back" aria-hidden="true" />
          <img src={marvelLogo} alt="Marvel" className="login__story-logo" />
        </div>

        <p className="micro-label">MARVEL HERO CONTROL SYSTEM</p>
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

      <form className="login__caja login__caja--v2" onSubmit={enviar}>
        <div className="login__hud-corners" aria-hidden="true" />
        <div
          className="login__brand login__brand--logo"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(230,36,41,.18), rgba(230,36,41,.02)), url(${comicTexture})` }}
        >
          <img src={marvelLogo} alt="Marvel" className="login__brand-logo" />
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
