package com.devhub.apz.ui.admin

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentAdminBinding

class AdminFragment : Fragment() {

    private var _binding: FragmentAdminBinding? = null
    private val binding get() = _binding!!
    private lateinit var adminViewModel: AdminViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminBinding.inflate(inflater, container, false)
        adminViewModel = ViewModelProvider(this)[AdminViewModel::class.java]
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)
        val roles = token?.let { com.devhub.apz.api.getUserRolesFromToken(it) } ?: emptyList()

        binding.btnAdminDashboard.visibility = View.GONE
        binding.btnServerAdminDashboard.visibility = View.GONE
        binding.btnDatabaseAdmin.visibility = View.GONE

        if (roles.contains("ADMIN")) {
            binding.btnAdminDashboard.visibility = View.VISIBLE
        }
        if (roles.contains("SERVER_ADMIN")) {
            binding.btnServerAdminDashboard.visibility = View.VISIBLE
        }
        if (roles.contains("DB_ADMIN")) {
            binding.btnDatabaseAdmin.visibility = View.VISIBLE
        }

        binding.btnAdminDashboard.setOnClickListener {
            findNavController().navigate(R.id.action_navigation_admin_to_adminDashboardFragment)
        }
        binding.btnServerAdminDashboard.setOnClickListener {
            findNavController().navigate(R.id.action_navigation_admin_to_serverAdminDashboardFragment)
        }
        binding.btnDatabaseAdmin.setOnClickListener {
            findNavController().navigate(R.id.action_navigation_admin_to_dbAdminDashboardFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}