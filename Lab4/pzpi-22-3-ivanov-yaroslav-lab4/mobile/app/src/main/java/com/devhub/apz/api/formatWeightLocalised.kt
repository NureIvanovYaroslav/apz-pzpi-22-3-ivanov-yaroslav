import android.content.Context

fun formatWeightLocalized(weightKg: Double, context: Context): String {
    val locale = context.resources.configuration.locales[0]
    return if (locale.language == "uk") {
        "${weightKg.toInt()} кг"
    } else {
        val lbs = weightKg * 2.20462
        String.format("%.1f lbs", lbs)
    }
}