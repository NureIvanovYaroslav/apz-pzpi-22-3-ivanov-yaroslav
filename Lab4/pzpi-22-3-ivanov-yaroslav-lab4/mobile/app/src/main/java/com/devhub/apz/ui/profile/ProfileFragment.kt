package com.devhub.apz.ui.profile

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentProfileBinding
import com.devhub.apz.api.getUserIdFromToken
import formatDateLocalized
import formatHeightLocalized
import formatWeightLocalized

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: ProfileViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[ProfileViewModel::class.java]
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val prefs = requireContext().getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val token = prefs.getString("token", null)
        val tokenUserId = token?.let { getUserIdFromToken(it) }

        if (tokenUserId != null && token != null) {
            viewModel.loadUser(tokenUserId, token)
        }

        viewModel.user.observe(viewLifecycleOwner) { userJson ->
            userJson?.let { json ->
                binding.tvEmailValue.text =
                    json.optString("email", getString(R.string.default_email))
                binding.tvUserNameValue.text =
                    json.optString("name", getString(R.string.default_username))

                binding.tvBirthDateValue.text =
                    json.optString("birthDate", "").let { dateStr ->
                        try {
                            val parser = java.text.SimpleDateFormat(
                                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                                java.util.Locale.getDefault()
                            ).apply {
                                timeZone = java.util.TimeZone.getTimeZone("UTC")
                            }
                            val date = parser.parse(dateStr)
                            val formatter = java.text.SimpleDateFormat(
                                getString(R.string.date_edit_format),
                                java.util.Locale.getDefault()
                            )
                            formatter.format(date!!)
                        } catch (e: Exception) {
                            dateStr
                        }
                    }

                binding.tvWeightValue.text =
                    formatWeightLocalized(json.optDouble("weight", 70.0), requireContext())
                binding.tvHeightValue.text =
                    formatHeightLocalized(json.optDouble("height", 175.0), requireContext())
                binding.tvCountryValue.text =
                    json.optString("country", getString(R.string.default_country))
                val sex = json.optString("sex", "female")
                binding.tvSexValue.text =
                    if (sex.lowercase() == "male") getString(R.string.male) else getString(R.string.female)
            }
        }

        binding.btnEditProfile.setOnClickListener {
            findNavController().navigate(R.id.action_profileFragment_to_editProfileFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}