package com.devhub.apz.ui.home

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentTrainingDetailsBinding
import com.devhub.apz.ui.training.TrainingDataAdapter
import formatDateLocalized

class TrainingDetailsFragment : Fragment() {
    private var _binding: FragmentTrainingDetailsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: TrainingDetailsViewModel
    private var trainingId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        trainingId = arguments?.getString("trainingId")
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTrainingDetailsBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[TrainingDetailsViewModel::class.java]

        binding.cardRecommendation.visibility = View.GONE
        binding.errorText.visibility = View.GONE
        binding.progressBar.visibility = View.GONE

        binding.btnRecommendSteps.setOnClickListener {
            performRecommendation("steps")
        }
        binding.btnRecommendCalories.setOnClickListener {
            performRecommendation("calories")
        }
        binding.btnRecommendHeart.setOnClickListener {
            performRecommendation("heart-rate")
        }

        binding.trainingDataRecyclerView.layoutManager = LinearLayoutManager(requireContext())
        loadTrainingDetails()
        observeViewModel()
        return binding.root
    }

    private fun loadTrainingDetails() {
        Log.d("TrainingDetails", "trainingId = $trainingId")
        if (trainingId == null) return
        binding.progressBar.visibility = View.VISIBLE
        binding.errorText.visibility = View.GONE

        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null) ?: return
        viewModel.loadTrainingDetails(trainingId!!, token)
    }

    private fun performRecommendation(type: String) {
        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null) ?: return
        if (trainingId == null) return
        viewModel.fetchRecommendation(trainingId!!, token, type)
    }

    private fun observeViewModel() {
        viewModel.loading.observe(viewLifecycleOwner) { loading ->
            binding.progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        }
        viewModel.error.observe(viewLifecycleOwner) { err ->
            binding.errorText.visibility = if (err != null) View.VISIBLE else View.GONE
            binding.errorText.text = err
        }
        viewModel.training.observe(viewLifecycleOwner) { trainingJson ->
            if (trainingJson != null) {
                binding.trainingType.text =
                    getString(R.string.training_type) + ": " + mapTrainingType(
                        trainingJson.optString(
                            "type",
                            ""
                        )
                    )
                binding.trainingStart.text =
                    getString(R.string.start) + ": " + formatDate(
                        trainingJson.optString(
                            "startTime",
                            ""
                        )
                    )
                binding.trainingEnd.text =
                    getString(R.string.end) + ": " + formatDate(
                        trainingJson.optString(
                            "endTime",
                            ""
                        )
                    )
            }
        }
        viewModel.trainingDatas.observe(viewLifecycleOwner) { dataList ->
            binding.trainingDataRecyclerView.adapter = TrainingDataAdapter(dataList)
        }
        viewModel.recommendation.observe(viewLifecycleOwner) { rec ->
            if (!rec.isNullOrEmpty()) {
                binding.cardRecommendation.visibility = View.VISIBLE
                binding.tvRecommendation.text = rec
            } else {
                binding.cardRecommendation.visibility = View.GONE
            }
        }
        viewModel.recError.observe(viewLifecycleOwner) { recErr ->
            if (!recErr.isNullOrEmpty()) {
                binding.cardRecommendation.visibility = View.GONE
                binding.errorText.visibility = View.VISIBLE
                binding.errorText.text = recErr
            }
        }
    }

    private fun mapTrainingType(type: String): String {
        return when (type) {
            "run" -> getString(R.string.type_running)
            "walk" -> getString(R.string.type_walking)
            "strength" -> getString(R.string.type_strength)
            "cycle" -> getString(R.string.type_cycling)
            else -> getString(R.string.type_unknown)
        }
    }

    private fun formatDate(dateStr: String): String {
        return formatDateLocalized(dateStr, requireContext())
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}