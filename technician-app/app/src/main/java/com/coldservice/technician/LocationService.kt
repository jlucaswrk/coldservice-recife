package com.coldservice.technician

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import com.google.gson.Gson
import kotlinx.coroutines.*
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class LocationService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private val client = OkHttpClient()
    private val gson = Gson()
    private val serviceScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    companion object {
        const val TAG = "LocationService"
        const val ACTION_START = "ACTION_START"
        const val ACTION_STOP = "ACTION_STOP"
        const val EXTRA_TECHNICIAN_ID = "TECHNICIAN_ID"
        const val EXTRA_SESSION_ID = "SESSION_ID"
        const val EXTRA_API_URL = "API_URL"

        // Default API URL - change to your production URL
        const val DEFAULT_API_URL = "https://coldservice-recife.vercel.app/api/technician-location"
    }

    private var technicianId: String = "tech_001"
    private var sessionId: String = ""
    private var apiUrl: String = DEFAULT_API_URL

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        setupLocationCallback()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                technicianId = intent.getStringExtra(EXTRA_TECHNICIAN_ID) ?: "tech_001"
                sessionId = intent.getStringExtra(EXTRA_SESSION_ID) ?: System.currentTimeMillis().toString()
                apiUrl = intent.getStringExtra(EXTRA_API_URL) ?: DEFAULT_API_URL

                startForeground(1, createNotification())
                startLocationUpdates()
            }
            ACTION_STOP -> {
                stopLocationUpdates()
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }
        }
        return START_STICKY
    }

    private fun createNotification(): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, ColdServiceApp.CHANNEL_ID)
            .setContentTitle("Cold Service")
            .setContentText("Compartilhando localização...")
            .setSmallIcon(R.drawable.ic_location)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun setupLocationCallback() {
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                result.lastLocation?.let { location ->
                    Log.d(TAG, "Location: ${location.latitude}, ${location.longitude}")
                    sendLocationToServer(location.latitude, location.longitude)
                }
            }
        }
    }

    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            5000L // Update every 5 seconds
        ).apply {
            setMinUpdateIntervalMillis(3000L)
            setWaitForAccurateLocation(false)
        }.build()

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            Log.e(TAG, "Location permission not granted", e)
        }
    }

    private fun stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
        // Send offline status
        serviceScope.launch {
            sendStatusToServer(online = false)
        }
    }

    private fun sendLocationToServer(lat: Double, lng: Double) {
        serviceScope.launch {
            try {
                val payload = mapOf(
                    "technicianId" to technicianId,
                    "sessionId" to sessionId,
                    "latitude" to lat,
                    "longitude" to lng,
                    "timestamp" to System.currentTimeMillis(),
                    "online" to true
                )

                val json = gson.toJson(payload)
                val body = json.toRequestBody("application/json".toMediaType())

                val request = Request.Builder()
                    .url(apiUrl)
                    .post(body)
                    .build()

                client.newCall(request).execute().use { response ->
                    if (!response.isSuccessful) {
                        Log.e(TAG, "Failed to send location: ${response.code}")
                    } else {
                        Log.d(TAG, "Location sent successfully")
                    }
                }
            } catch (e: IOException) {
                Log.e(TAG, "Network error", e)
            }
        }
    }

    private suspend fun sendStatusToServer(online: Boolean) {
        try {
            val payload = mapOf(
                "technicianId" to technicianId,
                "sessionId" to sessionId,
                "online" to online,
                "timestamp" to System.currentTimeMillis()
            )

            val json = gson.toJson(payload)
            val body = json.toRequestBody("application/json".toMediaType())

            val request = Request.Builder()
                .url(apiUrl)
                .post(body)
                .build()

            client.newCall(request).execute().close()
        } catch (e: IOException) {
            Log.e(TAG, "Failed to send offline status", e)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        stopLocationUpdates()
    }
}
