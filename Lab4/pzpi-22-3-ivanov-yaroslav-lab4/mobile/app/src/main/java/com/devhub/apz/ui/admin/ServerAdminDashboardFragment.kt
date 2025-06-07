package com.devhub.apz.ui.admin

import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentServerAdminDashboardBinding
import org.json.JSONObject
import java.util.Calendar
import java.util.Locale

class ServerAdminDashboardFragment : Fragment() {

    private var _binding: FragmentServerAdminDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: ServerAdminDashboardViewModel

    private fun formatBytes(bytes: Double): String {
        return getString(R.string.format_mb, bytes / (1024 * 1024))
    }

    private fun formatStatus(status: JSONObject): String {
        val sb = StringBuilder()
        val statusStr = status.optString("status", getString(R.string.unknown))
        val indicator = if (statusStr.uppercase(Locale.getDefault()) == "OK") "🟢" else "🔴"
        sb.append(getString(R.string.server_status_title)).append("\n")
        sb.append(getString(R.string.server_status_status)).append(": $indicator $statusStr\n")
        sb.append(getString(R.string.server_status_uptime)).append(
            ": ${
                String.format(
                    getString(R.string.format_one_decimal),
                    status.optDouble("uptime", 0.0)
                )
            } ${getString(R.string.seconds)}\n"
        )
        val timestampStr = status.optString("timestamp", "")
        val parsedDate = try {
            java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).apply {
                timeZone = java.util.TimeZone.getTimeZone("UTC")
            }.parse(timestampStr)
        } catch (e: Exception) {
            null
        }
        val timeFormatted = if (parsedDate != null) {
            java.text.SimpleDateFormat("MM/dd/yyyy, hh:mm:ss a", Locale.getDefault())
                .format(parsedDate)
        } else {
            timestampStr
        }
        sb.append(getString(R.string.server_status_time)).append(": $timeFormatted\n")
        val mem = status.optJSONObject("memoryUsage")
        if (mem != null) {
            sb.append(getString(R.string.server_status_memory)).append(":\n")
            sb.append(getString(R.string.server_status_rss))
                .append(": ${formatBytes(mem.optDouble("rss", 0.0))}\n")
            sb.append(getString(R.string.server_status_heap_total))
                .append(": ${formatBytes(mem.optDouble("heapTotal", 0.0))}\n")
            sb.append(getString(R.string.server_status_heap_used))
                .append(": ${formatBytes(mem.optDouble("heapUsed", 0.0))}\n")
            sb.append(getString(R.string.server_status_external))
                .append(": ${formatBytes(mem.optDouble("external", 0.0))}\n")
            sb.append(getString(R.string.server_status_array_buffers))
                .append(": ${formatBytes(mem.optDouble("arrayBuffers", 0.0))}\n")
        }
        return sb.toString()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentServerAdminDashboardBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[ServerAdminDashboardViewModel::class.java]
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.recyclerLogs.layoutManager = LinearLayoutManager(requireContext())
        binding.etConfig.visibility = View.GONE
        binding.btnUpdateConfig.visibility = View.GONE
        binding.btnPrevPage.visibility = View.GONE
        binding.btnNextPage.visibility = View.GONE
        binding.tvPageInfo.visibility = View.GONE

        binding.tvStatusResult.visibility = View.GONE
        binding.btnDeleteLogs.visibility = View.GONE

        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)
        if (token.isNullOrEmpty()) {
            Toast.makeText(requireContext(), getString(R.string.no_token), Toast.LENGTH_SHORT)
                .show()
            return
        }
        binding.btnFetchStatus.setOnClickListener {
            viewModel.fetchServerStatus(token)
        }
        viewModel.serverStatus.observe(viewLifecycleOwner) { status ->
            if (status != null) {
                binding.tvStatusResult.text = formatStatus(status)
                binding.tvStatusResult.visibility = View.VISIBLE
            }
        }

        binding.btnFetchConfig.setOnClickListener {
            viewModel.fetchServerConfig(token)
        }
        viewModel.serverConfig.observe(viewLifecycleOwner) { config ->
            if (config != null) {
                binding.etConfig.setText(config.toString(4))
                binding.etConfig.visibility = View.VISIBLE
                binding.btnUpdateConfig.visibility = View.VISIBLE
            }
        }
        binding.btnUpdateConfig.setOnClickListener {
            try {
                val newConfig = JSONObject(binding.etConfig.text.toString())
                viewModel.updateServerConfig(token, newConfig)
            } catch (e: Exception) {
                Toast.makeText(
                    requireContext(),
                    getString(R.string.invalid_json_format),
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        binding.btnFetchLogs.setOnClickListener {
            viewModel.fetchLogs(token, viewModel.currentLogsPage.value ?: 1)
            binding.btnPrevPage.visibility = View.VISIBLE
            binding.btnNextPage.visibility = View.VISIBLE
            binding.tvPageInfo.visibility = View.VISIBLE
            binding.btnDeleteLogs.visibility = View.VISIBLE
        }
        viewModel.logs.observe(viewLifecycleOwner) { logList ->
            binding.recyclerLogs.adapter = ServerLogAdapter(logList)
        }
        viewModel.currentLogsPage.observe(viewLifecycleOwner) { currentPage ->
            val total = viewModel.totalLogsPages.value ?: 1
            binding.tvPageInfo.text = getString(R.string.page_info, currentPage, total)
            binding.btnPrevPage.isEnabled = currentPage > 1
            binding.btnNextPage.isEnabled = currentPage < total
        }
        binding.btnPrevPage.setOnClickListener {
            val current = viewModel.currentLogsPage.value ?: 1
            if (current > 1) viewModel.paginateLogs(current - 1)
        }
        binding.btnNextPage.setOnClickListener {
            val current = viewModel.currentLogsPage.value ?: 1
            val total = viewModel.totalLogsPages.value ?: 1
            if (current < total) viewModel.paginateLogs(current + 1)
        }
        binding.btnDeleteLogs.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle(getString(R.string.delete_logs_title))
                .setMessage(getString(R.string.delete_logs_confirm))
                .setPositiveButton(getString(R.string.yes)) { _, _ ->
                    viewModel.deleteAllLogs(token) { success, msg ->
                        if (success) {
                            Toast.makeText(
                                requireContext(),
                                getString(R.string.logs_deleted),
                                Toast.LENGTH_SHORT
                            )
                                .show()
                            viewModel.fetchLogs(token, 1)
                        } else {
                            Toast.makeText(
                                requireContext(),
                                msg ?: getString(R.string.error),
                                Toast.LENGTH_SHORT
                            )
                                .show()
                        }
                    }
                }
                .setNegativeButton(getString(R.string.cancel), null)
                .show()
        }
        binding.btnDeleteLogsByDate.setOnClickListener {
            val date = binding.etDeleteLogsDate.text.toString().trim()
            if (date.isEmpty()) {
                Toast.makeText(requireContext(), getString(R.string.enter_date), Toast.LENGTH_SHORT)
                    .show()
                return@setOnClickListener
            }
            val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
            val token = prefs.getString("token", null)
            if (token.isNullOrEmpty()) {
                Toast.makeText(requireContext(), getString(R.string.no_token), Toast.LENGTH_SHORT)
                    .show()
                return@setOnClickListener
            }
            viewModel.deleteLogsByDate(token, date) { success, msg ->
                Toast.makeText(
                    requireContext(),
                    msg
                        ?: if (success) getString(R.string.logs_deleted) else getString(R.string.error),
                    Toast.LENGTH_SHORT
                ).show()
                if (success) {
                    viewModel.fetchLogs(token)
                }
            }
        }
        binding.etDeleteLogsDate.setOnClickListener {
            val calendar = Calendar.getInstance()
            val datePicker = android.app.DatePickerDialog(
                requireContext(),
                { _, year, month, dayOfMonth ->
                    val selected = String.format("%04d-%02d-%02d", year, month + 1, dayOfMonth)
                    binding.etDeleteLogsDate.setText(selected)
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            )
            datePicker.show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}