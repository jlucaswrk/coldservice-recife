# Cold Service - App do Técnico

App Android nativo para técnicos compartilharem localização em tempo real com clientes.

## Funcionalidades

- ✅ Botão simples liga/desliga compartilhamento
- ✅ Funciona em background (mesmo com tela bloqueada)
- ✅ Notificação persistente quando ativo
- ✅ Envia localização a cada 5 segundos
- ✅ Design dark mode com identidade Cold Service

## Requisitos

- Android Studio Hedgehog (2023.1.1) ou superior
- JDK 17
- Android SDK 34

## Build

### 1. Abrir no Android Studio

```bash
# Abrir a pasta technician-app no Android Studio
```

### 2. Gerar APK de Debug

```bash
# No Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
# Ou via terminal:
./gradlew assembleDebug
```

O APK estará em: `app/build/outputs/apk/debug/app-debug.apk`

### 3. Gerar APK de Release (para distribuição)

```bash
./gradlew assembleRelease
```

## Configuração

### Mudar URL da API

No arquivo `LocationService.kt`, altere a constante:

```kotlin
const val DEFAULT_API_URL = "https://sua-url.vercel.app/api/technician-location"
```

### Mudar ID do Técnico

No arquivo `MainActivity.kt`, altere:

```kotlin
putExtra(LocationService.EXTRA_TECHNICIAN_ID, "tech_001")
```

## Permissões Necessárias

O app solicita:
- **Localização em primeiro plano** - Para obter GPS
- **Localização em segundo plano** - Para funcionar com app minimizado
- **Notificações** - Para mostrar notificação quando ativo
- **Ignorar otimização de bateria** - Para não ser fechado pelo sistema

## Fluxo de Uso

1. Técnico abre o app
2. Concede permissões (primeira vez)
3. Toca no botão grande para ATIVAR
4. Pode fechar/minimizar o app
5. Localização é enviada automaticamente
6. Para parar: abrir app e tocar no botão novamente

## Estrutura

```
technician-app/
├── app/src/main/
│   ├── java/com/coldservice/technician/
│   │   ├── ColdServiceApp.kt      # Application + NotificationChannel
│   │   ├── MainActivity.kt        # UI principal (Jetpack Compose)
│   │   ├── LocationService.kt     # Foreground Service de localização
│   │   └── ui/theme/Theme.kt      # Tema e cores
│   ├── res/
│   │   ├── values/                # Strings, cores, temas
│   │   └── drawable/              # Ícones
│   └── AndroidManifest.xml        # Permissões e declarações
├── build.gradle.kts               # Dependências
└── settings.gradle.kts            # Configuração Gradle
```

## API Esperada

O app envia POST para a API com:

```json
{
  "technicianId": "tech_001",
  "sessionId": "1234567890",
  "latitude": -8.0476,
  "longitude": -34.8770,
  "timestamp": 1706745600000,
  "online": true
}
```

Quando o técnico desativa, envia `"online": false`.
