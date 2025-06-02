import android.content.Context

fun formatHeightLocalized(heightCm: Double, context: Context): String {
    val locale = context.resources.configuration.locales[0]
    return if (locale.language == "uk") {
        "${heightCm.toInt()} см"
    } else {
        val totalInches = heightCm / 2.54
        val feet = totalInches.toInt() / 12
        val inches = totalInches.toInt() % 12
        "${feet}'${inches}\""
    }
}