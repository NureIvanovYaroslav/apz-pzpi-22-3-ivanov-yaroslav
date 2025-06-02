import android.content.Context
import java.text.SimpleDateFormat
import java.util.*

fun formatDateLocalized(dateStr: String, context: Context): String {
    return try {
        val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
        parser.timeZone = TimeZone.getTimeZone("UTC")
        val date = parser.parse(dateStr)
        val locale = context.resources.configuration.locales[0]
        val pattern =
            if (locale.language == "uk") "dd.MM.yyyy, HH:mm:ss" else "MM/dd/yyyy, hh:mm:ss a"
        val formatter = SimpleDateFormat(pattern, locale)
        formatter.format(date!!)
    } catch (e: Exception) {
        dateStr
    }
}