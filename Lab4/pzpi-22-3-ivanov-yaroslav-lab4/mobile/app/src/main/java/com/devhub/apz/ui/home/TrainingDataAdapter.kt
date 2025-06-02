package com.devhub.apz.ui.training

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.devhub.apz.R
import com.devhub.apz.databinding.ItemTrainingDataBinding
import formatDateLocalized
import org.json.JSONObject

class TrainingDataAdapter(
    private val items: List<JSONObject>
) : RecyclerView.Adapter<TrainingDataAdapter.TrainingDataViewHolder>() {

    class TrainingDataViewHolder(val binding: ItemTrainingDataBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TrainingDataViewHolder {
        val binding =
            ItemTrainingDataBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TrainingDataViewHolder(binding)
    }

    private fun formatDate(dateStr: String, context: android.content.Context): String {
        return formatDateLocalized(dateStr, context)
    }

    override fun onBindViewHolder(holder: TrainingDataViewHolder, position: Int) {
        val obj = items[position]
        val context = holder.itemView.context
        holder.binding.tvTime.text = context.getString(R.string.time) + ": ${
            formatDate(
                obj.optString("sendingTime", ""),
                context
            )
        }"
        holder.binding.tvHeart.text =
            context.getString(R.string.heart_rate) + ": ${obj.optString("heartRate", "-")}"
        holder.binding.tvSteps.text =
            context.getString(R.string.steps) + ": ${obj.optString("steps", "-")}"
    }

    override fun getItemCount() = items.size
}