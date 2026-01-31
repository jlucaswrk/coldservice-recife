package com.coldservice.recife.location

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.os.Looper
import com.google.android.gms.location.*
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

/**
 * Serviço de Localização ULTRA PRECISA usando Fused Location Provider
 * Precisão esperada: 3-5 metros
 */
class LocationService(context: Context) {

    private val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    // Configuração para máxima precisão
    private val highAccuracyRequest = LocationRequest.Builder(
        Priority.PRIORITY_HIGH_ACCURACY,
        1000L // Atualização a cada 1 segundo
    ).apply {
        setMinUpdateIntervalMillis(500L)
        setMaxUpdateDelayMillis(2000L)
        setMinUpdateDistanceMeters(1f) // Atualiza com 1 metro de movimento
        setWaitForAccurateLocation(true)
    }.build()

    /**
     * Obtém localização única com alta precisão
     */
    @SuppressLint("MissingPermission")
    suspend fun getCurrentLocation(): Location? = suspendCancellableCoroutine { cont ->
        fusedLocationClient.getCurrentLocation(
            Priority.PRIORITY_HIGH_ACCURACY,
            null
        ).addOnSuccessListener { location ->
            cont.resume(location)
        }.addOnFailureListener { e ->
            cont.resumeWithException(e)
        }
    }

    /**
     * Flow de atualizações de localização em tempo real
     * Emite novas localizações conforme o usuário se move
     */
    @SuppressLint("MissingPermission")
    fun getLocationUpdates(): Flow<Location> = callbackFlow {
        val callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { location ->
                    trySend(location)
                }
            }
        }

        fusedLocationClient.requestLocationUpdates(
            highAccuracyRequest,
            callback,
            Looper.getMainLooper()
        )

        awaitClose {
            fusedLocationClient.removeLocationUpdates(callback)
        }
    }

    /**
     * Flow que busca a melhor precisão possível
     * Para quando atingir precisão alvo ou timeout
     */
    @SuppressLint("MissingPermission")
    fun getHighAccuracyLocation(
        targetAccuracy: Float = 10f, // 10 metros
        timeoutMs: Long = 30000L
    ): Flow<LocationUpdate> = callbackFlow {
        var bestLocation: Location? = null
        val startTime = System.currentTimeMillis()

        val callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { location ->
                    // Guarda a melhor localização
                    if (bestLocation == null || location.accuracy < bestLocation!!.accuracy) {
                        bestLocation = location
                    }

                    val update = LocationUpdate(
                        location = bestLocation!!,
                        accuracy = bestLocation!!.accuracy,
                        isRefining = bestLocation!!.accuracy > targetAccuracy,
                        isFinal = false
                    )
                    trySend(update)

                    // Para se atingiu precisão alvo
                    if (location.accuracy <= targetAccuracy) {
                        trySend(update.copy(isRefining = false, isFinal = true))
                        fusedLocationClient.removeLocationUpdates(this)
                        close()
                    }

                    // Timeout
                    if (System.currentTimeMillis() - startTime > timeoutMs) {
                        trySend(update.copy(isRefining = false, isFinal = true))
                        fusedLocationClient.removeLocationUpdates(this)
                        close()
                    }
                }
            }
        }

        fusedLocationClient.requestLocationUpdates(
            highAccuracyRequest,
            callback,
            Looper.getMainLooper()
        )

        awaitClose {
            fusedLocationClient.removeLocationUpdates(callback)
        }
    }
}

data class LocationUpdate(
    val location: Location,
    val accuracy: Float,
    val isRefining: Boolean,
    val isFinal: Boolean
)
