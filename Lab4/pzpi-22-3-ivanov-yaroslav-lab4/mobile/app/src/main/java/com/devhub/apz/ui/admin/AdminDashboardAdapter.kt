package com.devhub.apz.ui.admin

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.recyclerview.widget.RecyclerView
import com.devhub.apz.R
import com.devhub.apz.databinding.ItemAdminDashboardUserBinding
import com.devhub.apz.models.AdminUser

class AdminDashboardAdapter(
    private val users: List<AdminUser>,
    private val onAssignRole: (userId: String, roleCode: String) -> Unit,
    private val onRemoveRole: (userId: String, roleCode: String) -> Unit
) : RecyclerView.Adapter<AdminDashboardAdapter.AdminUserViewHolder>() {

    class AdminUserViewHolder(val binding: ItemAdminDashboardUserBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AdminUserViewHolder {
        val binding = ItemAdminDashboardUserBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return AdminUserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: AdminUserViewHolder, position: Int) {
        val user = users[position]
        val ctx = holder.itemView.context

        val displayNames = ctx.resources.getStringArray(R.array.role_display_names).toList()
        val roleCodes    = ctx.resources.getStringArray(R.array.role_values).toList()

        with(holder.binding) {
            tvEmail.text = user.email
            tvUsername.text = user.username
            tvRoles.text =
                if (user.roles.isEmpty()) ctx.getString(R.string.no_roles)
                else user.roles.joinToString(", ")

            val spinnerAdapter = ArrayAdapter(
                ctx,
                android.R.layout.simple_spinner_item,
                displayNames
            ).also { it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item) }
            spinnerRole.adapter = spinnerAdapter

            btnAssign.setOnClickListener {
                val idx = spinnerRole.selectedItemPosition
                onAssignRole(user.id, roleCodes[idx])
            }
            btnRemove.setOnClickListener {
                val idx = spinnerRole.selectedItemPosition
                onRemoveRole(user.id, roleCodes[idx])
            }
        }
    }

    override fun getItemCount() = users.size
}