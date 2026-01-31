package com.coldservice.technician.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Cold Service brand colors
val ColdBlue = Color(0xFF0EA5E9)
val ColdBlueDark = Color(0xFF0284C7)
val ColdGreen = Color(0xFF10B981)
val ColdGreenDark = Color(0xFF059669)
val DarkBackground = Color(0xFF0A0F1A)
val DarkSurface = Color(0xFF111827)
val DarkCard = Color(0xFF1F2937)

private val DarkColorScheme = darkColorScheme(
    primary = ColdBlue,
    onPrimary = Color.White,
    primaryContainer = ColdBlueDark,
    secondary = ColdGreen,
    onSecondary = Color.White,
    secondaryContainer = ColdGreenDark,
    background = DarkBackground,
    surface = DarkSurface,
    surfaceVariant = DarkCard,
    onBackground = Color.White,
    onSurface = Color.White,
    onSurfaceVariant = Color(0xFF9CA3AF),
    error = Color(0xFFEF4444)
)

@Composable
fun ColdServiceTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = DarkBackground.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
