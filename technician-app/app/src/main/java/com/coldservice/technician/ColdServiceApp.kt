package com.coldservice.technician

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class ColdServiceApp : Application() {

    companion object {
        const val CHANNEL_ID = "location_channel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Localização em tempo real",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Compartilhando sua localização com o cliente"
                setShowBadge(false)
            }

            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
}
