package com.coldservice.recife

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.coldservice.recife.ui.screens.IdentifyScreen
import com.coldservice.recife.ui.screens.TrackingScreen
import com.coldservice.recife.ui.theme.Background
import com.coldservice.recife.ui.theme.ColdServiceTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            ColdServiceTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Background
                ) {
                    ColdServiceApp()
                }
            }
        }
    }
}

@Composable
fun ColdServiceApp() {
    val navController = rememberNavController()
    var customerName by remember { mutableStateOf("") }

    NavHost(
        navController = navController,
        startDestination = "identify"
    ) {
        composable("identify") {
            IdentifyScreen(
                onStartTracking = { name ->
                    customerName = name
                    navController.navigate("tracking")
                }
            )
        }

        composable("tracking") {
            TrackingScreen(
                customerName = customerName,
                onBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}
