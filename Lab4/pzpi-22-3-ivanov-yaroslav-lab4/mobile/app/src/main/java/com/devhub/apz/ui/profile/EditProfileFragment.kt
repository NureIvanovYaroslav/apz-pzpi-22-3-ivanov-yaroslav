package com.devhub.apz.ui.profile

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentEditProfileBinding

class EditProfileFragment : Fragment() {

    private var _binding: FragmentEditProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: EditProfileViewModel

    private val sexOptions by lazy {
        listOf(getString(R.string.female), getString(R.string.male))
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentEditProfileBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[EditProfileViewModel::class.java]
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val adapter =
            ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, sexOptions)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerSex.adapter = adapter

        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)
        if (token != null) {
            viewModel.loadUserProfile(token)
        }

        viewModel.user.observe(viewLifecycleOwner) { user ->
            user?.let {
                binding.etName.setText(it.name)
                binding.etBirthDate.setText(formatDateForEdit(it.birthDate))
                binding.etWeight.setText(it.weight.toString())
                binding.etHeight.setText(it.height.toString())
                binding.etCountry.setText(it.country)
                val sexPos = when (it.sex.lowercase()) {
                    "male" -> sexOptions.indexOf(getString(R.string.male))
                    "female" -> sexOptions.indexOf(getString(R.string.female))
                    else -> 0
                }
                if (sexPos >= 0) binding.spinnerSex.setSelection(sexPos)
            }
        }

        binding.btnSave.setOnClickListener {
            val selectedSex = when (binding.spinnerSex.selectedItem) {
                getString(R.string.male) -> "male"
                getString(R.string.female) -> "female"
                else -> "female"
            }
            val updatedProfile = mapOf(
                "name" to binding.etName.text.toString().trim(),
                "birthDate" to binding.etBirthDate.text.toString().trim(),
                "weight" to binding.etWeight.text.toString().toDoubleOrNull(),
                "height" to binding.etHeight.text.toString().toDoubleOrNull(),
                "country" to binding.etCountry.text.toString().trim(),
                "sex" to selectedSex
            )
            token?.let { tok ->
                viewModel.updateUserProfile(tok, updatedProfile) { success, message ->
                    if (success) {
                        findNavController().popBackStack()
                    } else {
                    }
                }
            }
        }

        binding.btnCancel.setOnClickListener {
            findNavController().popBackStack()
        }
    }

    private fun formatDateForEdit(dateStr: String): String {
        return try {
            val parser = java.text.SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                java.util.Locale.getDefault()
            )
            parser.timeZone = java.util.TimeZone.getTimeZone("UTC")
            val date = parser.parse(dateStr)
            val formatter =
                java.text.SimpleDateFormat(
                    getString(R.string.date_edit_format),
                    java.util.Locale.getDefault()
                )
            formatter.format(date!!)
        } catch (e: Exception) {
            dateStr
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}