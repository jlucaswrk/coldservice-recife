package com.coldservice.technician

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.coldservice.technician.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private var isTracking by mutableStateOf(false)
    private var hasLocationPermission by mutableStateOf(false)
    private var hasBackgroundPermission by mutableStateOf(false)
    private var hasNotificationPermission by mutableStateOf(false)

    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        hasLocationPermission = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true
        checkBackgroundPermission()
    }

    private val backgroundPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasBackgroundPermission = granted
    }

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasNotificationPermission = granted
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        checkPermissions()

        setContent {
            ColdServiceTheme {
                MainScreen(
                    isTracking = isTracking,
                    hasLocationPermission = hasLocationPermission,
                    hasBackgroundPermission = hasBackgroundPermission,
                    onToggleTracking = { toggleTracking() },
                    onRequestPermissions = { requestAllPermissions() }
                )
            }
        }
    }

    private fun checkPermissions() {
        hasLocationPermission = ContextCompat.checkSelfPermission(
            this, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        hasBackgroundPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContextCompat.checkSelfPermission(
                this, Manifest.permission.ACCESS_BACKGROUND_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        } else true

        hasNotificationPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                this, Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else true
    }

    private fun requestAllPermissions() {
        // First request foreground location
        if (!hasLocationPermission) {
            locationPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        } else {
            checkBackgroundPermission()
        }

        // Request notification permission on Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !hasNotificationPermission) {
            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    private fun checkBackgroundPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q && hasLocationPermission && !hasBackgroundPermission) {
            backgroundPermissionLauncher.launch(Manifest.permission.ACCESS_BACKGROUND_LOCATION)
        }
    }

    private fun toggleTracking() {
        if (!hasLocationPermission) {
            requestAllPermissions()
            return
        }

        isTracking = !isTracking

        val intent = Intent(this, LocationService::class.java).apply {
            action = if (isTracking) LocationService.ACTION_START else LocationService.ACTION_STOP
            putExtra(LocationService.EXTRA_TECHNICIAN_ID, "tech_001")
            putExtra(LocationService.EXTRA_SESSION_ID, System.currentTimeMillis().toString())
        }

        if (isTracking) {
            // Request to disable battery optimization
            requestBatteryOptimizationExemption()
            startForegroundService(intent)
        } else {
            startService(intent)
        }
    }

    private fun requestBatteryOptimizationExemption() {
        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        if (!powerManager.isIgnoringBatteryOptimizations(packageName)) {
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                data = Uri.parse("package:$packageName")
            }
            startActivity(intent)
        }
    }
}

@Composable
fun MainScreen(
    isTracking: Boolean,
    hasLocationPermission: Boolean,
    hasBackgroundPermission: Boolean,
    onToggleTracking: () -> Unit,
    onRequestPermissions: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.6f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "alpha"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        DarkBackground,
                        DarkSurface
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(32.dp))

            // Logo/Header - Maior e mais legível
            Text(
                text = "COLD SERVICE",
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = ColdBlue,
                letterSpacing = 2.sp
            )

            Text(
                text = "Aplicativo do Técnico",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF9CA3AF),
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Instrução clara no topo
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = if (isTracking) Color(0xFF14532D) else Color(0xFF1E3A5F)
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (isTracking)
                            "VOCÊ ESTÁ VISÍVEL PARA O CLIENTE"
                            else "TOQUE NO BOTÃO ABAIXO PARA INICIAR",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isTracking)
                            "Sua localização está sendo enviada"
                            else "O cliente está aguardando você",
                        fontSize = 14.sp,
                        color = Color(0xFFD1D5DB),
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.weight(0.5f))

            // Main Button Area - Maior e mais claro
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.size(300.dp)
            ) {
                // Pulse rings when active
                if (isTracking) {
                    Box(
                        modifier = Modifier
                            .size(300.dp)
                            .scale(pulseScale)
                            .clip(CircleShape)
                            .background(ColdGreen.copy(alpha = pulseAlpha * 0.3f))
                    )
                    Box(
                        modifier = Modifier
                            .size(260.dp)
                            .scale(pulseScale)
                            .clip(CircleShape)
                            .background(ColdGreen.copy(alpha = pulseAlpha * 0.5f))
                    )
                }

                // Main button - Muito maior
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(220.dp)
                        .shadow(
                            elevation = if (isTracking) 24.dp else 12.dp,
                            shape = CircleShape,
                            ambientColor = if (isTracking) ColdGreen else ColdBlue,
                            spotColor = if (isTracking) ColdGreen else ColdBlue
                        )
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                colors = if (isTracking) {
                                    listOf(ColdGreen, ColdGreenDark)
                                } else {
                                    listOf(ColdBlue, ColdBlueDark)
                                }
                            )
                        )
                        .border(
                            width = 4.dp,
                            brush = Brush.linearGradient(
                                colors = if (isTracking) {
                                    listOf(ColdGreen.copy(alpha = 0.8f), ColdGreenDark)
                                } else {
                                    listOf(ColdBlue.copy(alpha = 0.8f), ColdBlueDark)
                                }
                            ),
                            shape = CircleShape
                        )
                        .clickable { onToggleTracking() }
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = if (isTracking) "LIGADO" else "DESLIGADO",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (isTracking) "Toque para\nPARAR" else "Toque para\nINICIAR",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.White.copy(alpha = 0.9f),
                            textAlign = TextAlign.Center,
                            lineHeight = 22.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(0.5f))

            // Status Card - Mais claro e legível
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = DarkCard),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(if (isTracking) ColdGreen else Color(0xFFEF4444))
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = if (isTracking) "LOCALIZAÇÃO ATIVA" else "LOCALIZAÇÃO PARADA",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isTracking) ColdGreen else Color(0xFFEF4444)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = if (isTracking)
                            "O cliente pode ver onde você está no mapa"
                            else "O cliente NÃO consegue ver sua posição",
                        fontSize = 15.sp,
                        color = Color(0xFF9CA3AF),
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Permission warning - Mais visível
            if (!hasLocationPermission || !hasBackgroundPermission) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onRequestPermissions() },
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFDC2626)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "ATENÇÃO!",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Você precisa permitir o acesso à localização",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.White)
                                .padding(12.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "TOQUE AQUI PARA PERMITIR",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFDC2626)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Footer
            Text(
                text = "Cold Service Refrigeração - Recife",
                fontSize = 14.sp,
                color = Color(0xFF6B7280)
            )
        }
    }
}
