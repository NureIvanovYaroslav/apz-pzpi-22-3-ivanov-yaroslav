package com.devhub.apz.ui.home

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.devhub.apz.R
import com.devhub.apz.databinding.ItemTrainingBinding
import com.devhub.apz.models.Training
import formatDateLocalized

class TrainingAdapter(
    private val items: List<Training>,
    private val onItemClick: (Training) -> Unit
) : RecyclerView.Adapter<TrainingAdapter.TrainingViewHolder>() {

    class TrainingViewHolder(val binding: ItemTrainingBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TrainingViewHolder {
        val binding =
            ItemTrainingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TrainingViewHolder(binding)
    }

    private fun mapTrainingType(context: Context, type: String): String {
        return when (type) {
            "run" -> context.getString(R.string.type_running)
            "walk" -> context.getString(R.string.type_walking)
            "strength" -> context.getString(R.string.type_strength)
            "cycle" -> context.getString(R.string.type_cycling)
            else -> type
        }
    }

    private fun formatDate(dateStr: String, context: Context): String {
        return formatDateLocalized(dateStr, context)
    }

    override fun onBindViewHolder(holder: TrainingViewHolder, position: Int) {
        val training = items[position]
        val context = holder.itemView.context
        holder.binding.tvType.text =
            context.getString(R.string.training_type) + ": " + mapTrainingType(
                context,
                training.type
            )
        holder.binding.tvStart.text =
            context.getString(R.string.start) + ": ${formatDate(training.startTime, context)}"
        holder.binding.tvEnd.text =
            context.getString(R.string.end) + ": ${formatDate(training.endTime, context)}"
        holder.itemView.setOnClickListener { onItemClick(training) }
    }

    override fun getItemCount() = items.size
}