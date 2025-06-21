# Organización de Servicios

## Estructura de Servicios

### Core Services (`src/app/core/services/`)
Servicios fundamentales singleton que proporcionan funcionalidad esencial para toda la aplicación.

#### `state/` - Gestión de Estado
- **`loading.service.ts`** - Manejo del estado de carga global
- **`theme.service.ts`** - Gestión de temas (claro/oscuro)
- **`side-bar.service.ts`** - Estado del sidebar de navegación

#### `ui/` - Servicios de UI Core
- **`media-query.service.ts`** - Detección de breakpoints y media queries

#### `application/` - Configuración de Aplicación
- Reservado para servicios de configuración global, autenticación core, etc.

### Shared Services (`src/app/shared/services/`)
Servicios reutilizables que pueden ser utilizados por múltiples módulos.

#### `data/` - Servicios de Datos
- **`lookup.service.ts`** - Manejo de catálogos y datos de referencia

#### `ui/` - Servicios de UI Compartidos
- **`notification.service.ts`** - Sistema de notificaciones y alertas
- **`notification-config.service.ts`** - Configuración de notificaciones

#### `utilities/` - Servicios Utilitarios
- **`api-error-handler.service.ts`** - Manejo centralizado de errores de API
- **`html-sanitizer.service.ts`** - Sanitización de contenido HTML

## Diferencias entre Core y Shared

### Core Services
- **Singleton**: Una sola instancia en toda la aplicación
- **Fundamentales**: Necesarios para el funcionamiento básico
- **Estado Global**: Manejan estado que afecta toda la aplicación
- **Ejemplos**: Autenticación, tema, configuración global

### Shared Services
- **Reutilizables**: Pueden ser usados por múltiples módulos
- **Utilitarios**: Proporcionan funcionalidad específica
- **Sin Estado Global**: No manejan estado crítico de la aplicación
- **Ejemplos**: Validadores, formatters, helpers

## Importaciones

### Usar los barrels (archivos index.ts) para importaciones limpias:

```typescript
// ✅ Correcto - desde core
import { LoadingService, ThemeService } from '@core/services';
import { LoadingService } from '@core/services/state';

// ✅ Correcto - desde shared
import { NotificationService } from '@shared/services';
import { NotificationService } from '@shared/services/ui';

// ❌ Evitar - importaciones directas profundas innecesarias
import { LoadingService } from '@core/services/state/loading.service';
```

## Path Mappings (tsconfig.json)

```json
{
  "paths": {
    "@core/*": ["app/core/*"],
    "@shared/*": ["app/shared/*"]
  }
}
```
