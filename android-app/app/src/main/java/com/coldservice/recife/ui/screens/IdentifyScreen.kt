package com.coldservice.recife.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.coldservice.recife.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IdentifyScreen(
    onStartTracking: (String) -> Unit
) {
    var name by remember { mutableStateOf("") }

    Scaffold(
        containerColor = Background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Header
            Column(
                modifier = Modifier.padding(top = 32.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text("🚨", style = MaterialTheme.typography.headlineMedium)
                    Text(
                        "Atendimento Urgente",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Accent
                    )
                }
                Text(
                    "Veja onde o técnico está em tempo real",
                    style = MaterialTheme.typography.bodyLarge,
                    color = TextSecondary
                )
            }

            // Input de nome
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    "Qual é o seu nome?",
                    style = MaterialTheme.typography.titleMedium,
                    color = OnSurface
                )
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = {
                        Text(
                            "Digite aqui seu nome",
                            color = TextMuted
                        )
                    },
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Primary,
                        unfocusedBorderColor = Border,
                        focusedContainerColor = SurfaceVariant,
                        unfocusedContainerColor = SurfaceVariant,
                        cursorColor = Primary,
                        focusedTextColor = OnSurface,
                        unfocusedTextColor = OnSurface
                    ),
                    shape = RoundedCornerShape(16.dp),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        capitalization = KeyboardCapitalization.Words,
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            if (name.isNotBlank()) {
                                onStartTracking(name.trim())
                            }
                        }
                    )
                )
            }

            // Card de instruções
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SurfaceVariant),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        "Como funciona:",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = OnSurface
                    )

                    Step(
                        number = 1,
                        text = "Você coloca seu nome e clica no botão verde"
                    )
                    Step(
                        number = 2,
                        text = "O técnico abre o aplicativo e liga a localização"
                    )
                    Step(
                        number = 3,
                        text = "Você vê no mapa onde ele está e quando chega"
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Botão iniciar
            Button(
                onClick = { onStartTracking(name.trim()) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp),
                enabled = name.isNotBlank(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF128C4A),
                    disabledContainerColor = Color(0xFF3D4A5C)
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(
                    if (name.isNotBlank()) "INICIAR AGORA" else "Digite seu nome acima",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun Step(
    number: Int,
    text: String
) {
    Row(
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(Primary),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "$number",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
        Text(
            text,
            style = MaterialTheme.typography.bodyLarge,
            color = TextSecondary,
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}
