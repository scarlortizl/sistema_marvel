/**
 * URL de la API REST.
 *
 * IMPORTANTE: el telefono NO puede usar "localhost" porque eso apunta al propio
 * telefono. Debe usarse la IP del computador dentro de la red WiFi (la misma red
 * a la que esta conectado el celular). Al levantar el backend, la consola imprime
 * esa direccion, por ejemplo:  http://192.168.18.13:4000/api
 *
 * Se puede cambiar aqui o definiendo EXPO_PUBLIC_API_URL en el archivo .env
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.18.13:4000/api';

export const CLAVE_TOKEN = 'marvel_token';
export const CLAVE_USUARIO = 'marvel_usuario';
export const CLAVE_FAVORITOS = 'marvel_favoritos';
