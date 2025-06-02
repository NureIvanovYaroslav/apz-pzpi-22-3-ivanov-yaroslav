package com.devhub.apz.ui.admin

import android.app.Application
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModelProvider
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentDbAdminDashboardBinding

class DbAdminDashboardFragment : Fragment() {

    private var _binding: FragmentDbAdminDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: DbAdminDashboardViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDbAdminDashboardBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[DbAdminDashboardViewModel::class.java]
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)
        if (token.isNullOrEmpty()) {
            Toast.makeText(requireContext(), getString(R.string.no_token), Toast.LENGTH_SHORT)
                .show()
            return
        }

        binding.btnCreateBackup.setOnClickListener {
            viewModel.createBackup(token)
        }

        binding.btnRestoreBackup.setOnClickListener {
            val backupName = binding.etBackupName.text.toString().trim()
            if (backupName.isEmpty()) {
                Toast.makeText(
                    requireContext(),
                    getString(R.string.enter_backup_name),
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }
            viewModel.restoreBackup(token, backupName)
        }

        binding.btnCheckDbStatus.setOnClickListener {
            viewModel.checkDatabaseStatus(token)
        }

        viewModel.backupResult.observe(viewLifecycleOwner) { result ->
            val (success, backupNameOrMsg) = result
            if (success && backupNameOrMsg != null) {
                binding.tvBackupResult.text = getString(R.string.backup_created_success)
            } else {
                binding.tvBackupResult.text = backupNameOrMsg ?: getString(R.string.error)
            }
        }

        viewModel.dbStatus.observe(viewLifecycleOwner) { status ->
            if (status != null) {
                val connectionStatus =
                    if (status.optString("status", "").equals("Connected", ignoreCase = true))
                        getString(R.string.connected) else getString(R.string.disconnected)
                val state = status.optInt("state", 0)
                val stateDesc =
                    if (state == 1) getString(R.string.connected) else getString(R.string.disconnected)
                val host = status.optString("host", getString(R.string.not_available))
                val dbName = status.optString("name", getString(R.string.not_available))
                val formatted = getString(R.string.db_status_title) + "\n" +
                        getString(R.string.connection_status) + ": $connectionStatus\n" +
                        getString(R.string.state) + ": $state ($stateDesc)\n" +
                        getString(R.string.host) + ": $host\n" +
                        getString(R.string.database_name) + ": $dbName"
                binding.tvDbStatus.text = formatted
            } else {
                binding.tvDbStatus.text = getString(R.string.no_data)
            }
        }

        viewModel.restoreResult.observe(viewLifecycleOwner) { result ->
            val (_, msg) = result
            Toast.makeText(requireContext(), msg ?: "", Toast.LENGTH_SHORT).show()
        }

        viewModel.error.observe(viewLifecycleOwner) { err ->
            err?.let { Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show() }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}