package com.devhub.apz.ui.auth

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.devhub.apz.R
import com.devhub.apz.databinding.FragmentRegistrationBinding

class RegistrationFragment : Fragment() {
    private var _binding: FragmentRegistrationBinding? = null
    private val binding get() = _binding!!
    private lateinit var registrationViewModel: RegistrationViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRegistrationBinding.inflate(inflater, container, false)
        registrationViewModel = ViewModelProvider(this)[RegistrationViewModel::class.java]

        binding.btnRegister.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            val repeatPassword = binding.etRepeatPassword.text.toString().trim()
            binding.authError.text = ""
            when {
                email.isEmpty() -> binding.authError.text = getString(R.string.enter_email)
                password.length < 7 -> binding.authError.text =
                    getString(R.string.password_too_short)

                password != repeatPassword -> binding.authError.text =
                    getString(R.string.passwords_not_match)

                else -> registrationViewModel.register(email, password)
            }
        }

        binding.tvLogin.setOnClickListener {
            findNavController().navigate(R.id.action_registrationFragment_to_loginFragment)
        }

        registrationViewModel.registrationResult.observe(viewLifecycleOwner) { result ->
            val (success, message) = result
            if (success) {
                findNavController().navigate(R.id.navigation_home)
            } else {
                binding.authError.text = message ?: getString(R.string.registration_failed)
            }
        }

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}