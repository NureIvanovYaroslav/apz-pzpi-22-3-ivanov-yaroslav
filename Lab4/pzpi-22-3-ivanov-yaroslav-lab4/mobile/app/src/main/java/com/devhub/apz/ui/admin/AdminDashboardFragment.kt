package com.devhub.apz.ui.admin

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
import com.devhub.apz.databinding.FragmentAdminDashboardBinding

class AdminDashboardFragment : Fragment() {

    private var _binding: FragmentAdminDashboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: AdminDashboardViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAdminDashboardBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[AdminDashboardViewModel::class.java]
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.recyclerUsers.layoutManager = LinearLayoutManager(requireContext())

        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)
        if (token.isNullOrEmpty()) {
            Toast.makeText(requireContext(), getString(R.string.no_token), Toast.LENGTH_SHORT)
                .show()
            return
        }

        viewModel.loadUsers(token)
        viewModel.users.observe(viewLifecycleOwner) { userList ->
            binding.recyclerUsers.adapter = AdminDashboardAdapter(
                users = userList,
                onAssignRole = { userId, roleCode ->
                    viewModel.assignRole(userId, roleCode, token) { success, msg ->
                        if (success) {
                            Toast.makeText(
                                requireContext(),
                                getString(R.string.role_assigned),
                                Toast.LENGTH_SHORT
                            )
                                .show()
                            viewModel.loadUsers(token)
                        } else {
                            Toast.makeText(
                                requireContext(),
                                msg ?: getString(R.string.error),
                                Toast.LENGTH_SHORT
                            )
                                .show()
                        }
                    }
                },
                onRemoveRole = { userId, roleCode ->
                    viewModel.removeRole(userId, roleCode, token) { success, msg ->
                        if (success) {
                            Toast.makeText(
                                requireContext(),
                                getString(R.string.role_removed),
                                Toast.LENGTH_SHORT
                            )
                                .show()
                            viewModel.loadUsers(token)
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
            )
        }
        viewModel.error.observe(viewLifecycleOwner) { err ->
            err?.let {
                Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}