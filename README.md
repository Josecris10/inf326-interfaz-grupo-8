# Tarea 7 Arquitectura de Software INF326
Integrantes:
- Jan Jorquera.
- Jose Astudillo.
- Alessandro Cintolesi.

- Enlace al respositorio: ``https://github.com/Josecris10/inf326-interfaz-grupo-8``
- Video Explicativo de la tarea: ``https://youtu.be/WRbSw60I8iw``

## Observaciones:
- Este repositorio incluye la interfaz desarrollada a partir de los microservicios disponibles en el cluster
del curso, esta interfaz se encuentra disponible en el mismo cluster accediendo a la URL ``https://grupo8interfaz.inf326.nursoft.dev/``.
- Tambien se incluye el apigateway correspondiente el cual se encuentra disponible en el cluster del curso accediendo a la URL ``https://grupo8apigateway.inf326.nursoft.dev/``.
- Se utilizaron **mocks** en partes especificas debido a la falta de comunicación y/o retraso en la respuesta de los grupos responsables.
- Fe de erratas: en el video se dice que no hubo conexión con el microservicio de moderación pero si la hubo, solo que no se evidencia debido a la ausencia de datos reales en el microservicio de mensajes.
- Finalemnte en el apartado de búsqueda que se refleja tanto en el vídeo y que es parte de nuestro microservicio no funciona apropiadamente (se utilizaron mocks) debido a que algunos grupos como el servicio de hebras decidieron implementar sus propios messages-brokers y no conectarse al que fue provisto por nuestro grupo y que otros servicios si se conectaron hace alrededor de 1 mes, en un intento nuestro por unificar todo. Algunos de éstos equipos fueron contactados por privado, solicitandoles realizar esta unificación pero hicieron caso omiso.