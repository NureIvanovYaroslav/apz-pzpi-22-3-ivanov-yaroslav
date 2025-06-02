package com.devhub.apz.ui.admin

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.devhub.apz.R
import com.devhub.apz.databinding.ItemServerLogBinding
import formatDateLocalized
import org.json.JSONObject

class ServerLogAdapter(private val logs: List<JSONObject>) :
    RecyclerView.Adapter<ServerLogAdapter.ServerLogViewHolder>() {

    class ServerLogViewHolder(val binding: ItemServerLogBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ServerLogViewHolder {
        val binding =
            ItemServerLogBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ServerLogViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ServerLogViewHolder, position: Int) {
        val log = logs[position]
        val dateStr = log.optString("date", "")
        val context = holder.itemView.context
        val formattedDate = formatDateLocalized(dateStr, context)
        holder.binding.tvLogDate.text = formattedDate
        holder.binding.tvLogUser.text =
            log.optString("userId", context.getString(R.string.not_available))
        holder.binding.tvLogDescription.text = log.optString("description", "")
        val status = if (log.optBoolean("success", false))
            context.getString(R.string.success)
        else
            context.getString(R.string.failure)
        holder.binding.tvLogStatus.text = status
    }

    override fun getItemCount() = logs.size
}