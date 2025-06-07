package com.devhub.apz.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var homeViewModel: HomeViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        homeViewModel = ViewModelProvider(this)[HomeViewModel::class.java]
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        binding.trainingsRecycler.layoutManager = LinearLayoutManager(requireContext())

        homeViewModel.loadTrainings()

        homeViewModel.error.observe(viewLifecycleOwner) { error ->
            when (error) {
                "not-auth" -> {
                    binding.textOfNoData.text = getString(R.string.no_trainings_auth)
                    binding.textOfNoData.visibility = View.VISIBLE
                    binding.textHome.visibility = View.GONE
                    binding.trainingsRecycler.visibility = View.GONE
                }

                null -> {
                    binding.textOfNoData.visibility = View.GONE
                    binding.textHome.visibility = View.VISIBLE
                    binding.trainingsRecycler.visibility = View.VISIBLE
                }

                else -> {
                    binding.textOfNoData.text = getString(R.string.no_trainings)
                    binding.textOfNoData.visibility = View.VISIBLE
                    binding.textHome.visibility = View.GONE
                    binding.trainingsRecycler.visibility = View.GONE
                }
            }
        }

        homeViewModel.trainings.observe(viewLifecycleOwner) { trainings ->
            if (trainings.isNullOrEmpty()) {
                binding.textOfNoData.text = getString(R.string.no_trainings_alt)
                binding.textOfNoData.visibility = View.VISIBLE
                binding.textHome.visibility = View.GONE
                binding.trainingsRecycler.adapter = TrainingAdapter(emptyList()) { }
                binding.trainingsRecycler.visibility = View.GONE
            } else {
                binding.textOfNoData.visibility = View.GONE
                binding.textHome.visibility = View.VISIBLE
                binding.trainingsRecycler.adapter =
                    TrainingAdapter(trainings.sortedByDescending { it.startTime }) { training ->
                        val bundle = Bundle().apply { putString("trainingId", training.id) }
                        findNavController().navigate(R.id.action_home_to_trainingDetails, bundle)
                    }
                binding.trainingsRecycler.visibility = View.VISIBLE
            }

        }

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}