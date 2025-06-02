package com.devhub.apz

import android.content.Context
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.devhub.apz.databinding.ActivityMainBinding
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)

        val navView: BottomNavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_activity_main)

        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_home, R.id.navigation_profile, R.id.navigation_admin
            )
        )
        binding.toolbar.setupWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
        navController.addOnDestinationChangedListener { _, destination, _ ->
            when (destination.id) {
                R.id.loginFragment, R.id.registrationFragment -> {
                    navView.visibility = android.view.View.GONE
                    supportActionBar?.hide()
                }

                else -> {
                    navView.visibility = android.view.View.VISIBLE
                    supportActionBar?.show()
                }
            }
            invalidateOptionsMenu()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.top_nav_menu, menu)

        val prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)

        menu?.findItem(R.id.action_auth)?.apply {
            if (token.isNullOrEmpty()) {
                title = "Войти"
                setIcon(R.drawable.ic_login)
            } else {
                title = "Выйти"
                setIcon(R.drawable.ic_logout)
            }
        }

        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_auth -> {
                val prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
                val token = prefs.getString("token", null)
                val navController = findNavController(R.id.nav_host_fragment_activity_main)

                if (token.isNullOrEmpty()) {
                    navController.navigate(R.id.loginFragment)
                } else {
                    prefs.edit().remove("token").apply()
                    navController.navigate(R.id.loginFragment)
                }
                true
            }

            else -> super.onOptionsItemSelected(item)
        }
    }

}