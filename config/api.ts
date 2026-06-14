/**
 * @file api.ts
 * @description Centraliza e exporta as configurações de rede do ecossistema.
 * Essencial para evitar a repetição de URLs estáticas ao longo do ciclo de requisições HTTP.
 */

/**
 * URL Base de comunicação com o servidor Back-end (Spring Boot).
 * @constant {string}
 * @note Substitua pelo IP da sua máquina local na rede Wi-Fi ao testar em dispositivo físico.
 */
export const API_URL = "http://192.168.0.104:8080";
