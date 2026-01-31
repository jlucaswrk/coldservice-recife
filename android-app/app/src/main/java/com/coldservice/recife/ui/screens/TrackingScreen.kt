package com.coldservice.recife.ui.screens

import android.Manifest
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import com.coldservice.recife.ui.theme.*
import com.coldservice.recife.location.LocationService
import com.coldservice.recife.location.LocationUpdate
import kotlinx.coroutines.flow.catch

@OptIn(ExperimentalPermissionsApi::class, ExperimentalMaterial3Api::class)
@Composable
fun TrackingScreen(
    customerName: String,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val locationService = remember { LocationService(context) }

    var locationUpdate by remember { mutableStateOf<LocationUpdate?>(null) }
    var technicianOnline by remember { mutableStateOf(false) }
    var distance by remember { mutableStateOf<Float?>(null) }

    // Permissões de localização
    val locationPermissions = rememberMultiplePermissionsState(
        permissions = listOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
    )

    // Animação do radar
    val infiniteTransition = rememberInfiniteTransition(label = "radar")
    val radarAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "radarAngle"
    )

    // Animação de pulso
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.5f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    // Coleta localização
    LaunchedEffect(locationPermissions.allPermissionsGranted) {
        if (locationPermissions.allPermissionsGranted) {
            locationService.getHighAccuracyLocation(
                targetAccuracy = 10f,
                timeoutMs = 60000L
            ).catch { e ->
                // Erro de localização
            }.collect { update ->
                locationUpdate = update
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            "Atendimento Urgente",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            "Olá, $customerName",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Voltar")
                    }
                },
                actions = {
                    // Status indicator
                    Box(
                        modifier = Modifier
                            .padding(end = 16.dp)
                            .size(12.dp)
                            .clip(CircleShape)
                            .background(if (technicianOnline) Online else Warning)
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Surface,
                    titleContentColor = OnSurface
                )
            )
        },
        containerColor = Background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Card de status da localização
            LocationStatusCard(
                locationUpdate = locationUpdate,
                permissionsGranted = locationPermissions.allPermissionsGranted,
                onRequestPermission = { locationPermissions.launchMultiplePermissionRequest() }
            )

            // Mapa visual
            TrackingMapCard(
                radarAngle = radarAngle,
                pulseScale = pulseScale,
                technicianOnline = technicianOnline,
                customerLocation = locationUpdate?.location,
                modifier = Modifier.weight(1f)
            )

            // Status do técnico
            TechnicianStatusCard(
                isOnline = technicianOnline,
                distance = distance
            )

            // Botão WhatsApp
            WhatsAppButton(
                customerName = customerName,
                onClick = {
                    val message = "Olá! Sou $customerName e estou aguardando o atendimento de urgência."
                    val url = "https://wa.me/5581986804024?text=${Uri.encode(message)}"
                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                }
            )
        }
    }
}

@Composable
fun LocationStatusCard(
    locationUpdate: LocationUpdate?,
    permissionsGranted: Boolean,
    onRequestPermission: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = when {
                !permissionsGranted -> SurfaceVariant
                locationUpdate?.isRefining == true -> SurfaceVariant
                locationUpdate != null -> SurfaceVariant
                else -> SurfaceVariant
            }
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            when {
                !permissionsGranted -> {
                    Icon(
                        Icons.Default.LocationOff,
                        contentDescription = null,
                        tint = Warning,
                        modifier = Modifier.size(24.dp)
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Permissão necessária",
                            style = MaterialTheme.typography.titleSmall,
                            color = Warning
                        )
                        Text(
                            "Precisamos da sua localização para o técnico te encontrar",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                    TextButton(onClick = onRequestPermission) {
                        Text("Permitir")
                    }
                }
                locationUpdate?.isRefining == true -> {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = Primary,
                        strokeWidth = 2.dp
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Refinando localização...",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = Primary
                        )
                        Text(
                            "Precisão atual: ±${locationUpdate.accuracy.toInt()}m" +
                                    when {
                                        locationUpdate.accuracy > 15 -> " (aguarde...)"
                                        locationUpdate.accuracy > 10 -> " (quase lá!)"
                                        else -> " (excelente!)"
                                    },
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                }
                locationUpdate != null -> {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Online,
                        modifier = Modifier.size(24.dp)
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Localização precisa ✓",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold,
                            color = Online
                        )
                        Text(
                            "Precisão: ±${locationUpdate.accuracy.toInt()}m" +
                                    if (locationUpdate.accuracy <= 5) " 🎯 Fused GPS" else " (GPS)",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TrackingMapCard(
    radarAngle: Float,
    pulseScale: Float,
    technicianOnline: Boolean,
    customerLocation: android.location.Location?,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(16.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Grid de fundo
            Canvas(modifier = Modifier.fillMaxSize()) {
                val gridSize = 30.dp.toPx()
                for (x in 0..size.width.toInt() step gridSize.toInt()) {
                    drawLine(
                        color = Border.copy(alpha = 0.3f),
                        start = Offset(x.toFloat(), 0f),
                        end = Offset(x.toFloat(), size.height),
                        strokeWidth = 1f
                    )
                }
                for (y in 0..size.height.toInt() step gridSize.toInt()) {
                    drawLine(
                        color = Border.copy(alpha = 0.3f),
                        start = Offset(0f, y.toFloat()),
                        end = Offset(size.width, y.toFloat()),
                        strokeWidth = 1f
                    )
                }

                // Radar sweep
                if (technicianOnline) {
                    drawArc(
                        brush = Brush.sweepGradient(
                            0f to Color.Transparent,
                            0.1f to Online.copy(alpha = 0.2f),
                            0.2f to Color.Transparent
                        ),
                        startAngle = radarAngle,
                        sweepAngle = 60f,
                        useCenter = true,
                        topLeft = Offset(size.width / 4, size.height / 4),
                        size = androidx.compose.ui.geometry.Size(size.width / 2, size.height / 2)
                    )
                }
            }

            // Customer marker (centro)
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .offset(y = 40.dp)
            ) {
                // Pulso
                Box(
                    modifier = Modifier
                        .size((32 * pulseScale).dp)
                        .align(Alignment.Center)
                        .clip(CircleShape)
                        .background(Accent.copy(alpha = 0.2f))
                )
                // Marcador
                Box(
                    modifier = Modifier
                        .size(16.dp)
                        .align(Alignment.Center)
                        .clip(CircleShape)
                        .background(Accent)
                        .border(2.dp, Color.White, CircleShape)
                )
            }

            // Legenda
            Row(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .background(
                        Background.copy(alpha = 0.9f),
                        RoundedCornerShape(8.dp)
                    )
                    .padding(8.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(Accent)
                    )
                    Text("Você", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(Online)
                    )
                    Text("Técnico", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                }
            }
        }
    }
}

@Composable
fun TechnicianStatusCard(
    isOnline: Boolean,
    distance: Float?
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (isOnline) Online.copy(alpha = 0.1f) else Warning.copy(alpha = 0.1f)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(12.dp)
                    .clip(CircleShape)
                    .background(if (isOnline) Online else Warning)
            )
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    if (isOnline) "TÉCNICO A CAMINHO!" else "AGUARDANDO O TÉCNICO",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = if (isOnline) Online else Warning
                )
                Text(
                    if (isOnline) {
                        "Você pode ver a localização dele no mapa"
                    } else {
                        "O técnico precisa abrir o app e ligar a localização"
                    },
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
            if (isOnline && distance != null) {
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        "${distance.toInt()}m",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Primary
                    )
                    Text(
                        "distância",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextMuted
                    )
                }
            }
        }
    }
}

@Composable
fun WhatsAppButton(
    customerName: String,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF128C4A)
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Icon(
            Icons.Default.Chat,
            contentDescription = null,
            modifier = Modifier.size(24.dp)
        )
        Spacer(Modifier.width(12.dp))
        Text(
            "FALAR NO WHATSAPP",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
        )
    }
}
