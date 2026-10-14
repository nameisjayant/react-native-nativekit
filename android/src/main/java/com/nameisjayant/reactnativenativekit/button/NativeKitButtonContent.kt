package com.nameisjayant.reactnativenativekit.button

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** Snapshot of the props sent from JS. Colors are ARGB ints, `null` meaning "use the default". */
internal data class NativeKitButtonState(
  val title: String = "",
  val variant: String = "filled",
  val size: String = "medium",
  val color: Int? = null,
  val textColor: Int? = null,
  val disabled: Boolean = false,
  val loading: Boolean = false,
  val cornerRadius: Float = -1f,
  val fontSize: Float = 0f,
  val fontWeight: String = "default",
)

@Composable
internal fun NativeKitButtonContent(state: NativeKitButtonState, onPress: () -> Unit) {
  MaterialTheme {
    val accent = state.color?.let(::Color) ?: Color.Unspecified
    val content = state.textColor?.let(::Color) ?: Color.Unspecified
    val enabled = !state.disabled
    val onClick = { if (!state.loading) onPress() }
    val modifier = Modifier.fillMaxSize()
    val shape: Shape =
      if (state.cornerRadius >= 0f) RoundedCornerShape(state.cornerRadius.dp) else ButtonDefaults.shape
    val padding = PaddingValues(
      horizontal = when (state.size) {
        "small" -> 12.dp
        "large" -> 32.dp
        else -> 24.dp
      }
    )
    val label: @Composable RowScope.() -> Unit = { ButtonLabel(state) }

    when (state.variant) {
      // No glass material on Android; tonal is the closest translucent look.
      "tonal", "glass" -> FilledTonalButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        shape = shape,
        colors = ButtonDefaults.filledTonalButtonColors(containerColor = accent, contentColor = content),
        contentPadding = padding,
        content = label,
      )

      "outlined" -> OutlinedButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        shape = shape,
        colors = ButtonDefaults.outlinedButtonColors(contentColor = content.takeOrElse(accent)),
        border = BorderStroke(
          1.dp,
          when {
            !enabled -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.12f)
            accent != Color.Unspecified -> accent
            else -> MaterialTheme.colorScheme.outline
          }
        ),
        contentPadding = padding,
        content = label,
      )

      "text" -> TextButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        shape = shape,
        colors = ButtonDefaults.textButtonColors(contentColor = content.takeOrElse(accent)),
        contentPadding = padding,
        content = label,
      )

      "elevated" -> ElevatedButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        shape = shape,
        colors = ButtonDefaults.elevatedButtonColors(containerColor = accent, contentColor = content),
        contentPadding = padding,
        content = label,
      )

      else -> Button(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
        shape = shape,
        colors = ButtonDefaults.buttonColors(containerColor = accent, contentColor = content),
        contentPadding = padding,
        content = label,
      )
    }
  }
}

@Composable
private fun RowScope.ButtonLabel(state: NativeKitButtonState) {
  val textStyle = when (state.size) {
    "small" -> MaterialTheme.typography.labelMedium
    "large" -> MaterialTheme.typography.titleMedium
    else -> MaterialTheme.typography.labelLarge
  }
  if (state.loading) {
    CircularProgressIndicator(
      modifier = Modifier.size(
        when (state.size) {
          "small" -> 14.dp
          "large" -> 20.dp
          else -> 18.dp
        }
      ),
      color = LocalContentColor.current,
      strokeWidth = 2.dp,
    )
    if (state.title.isNotEmpty()) Spacer(Modifier.width(8.dp))
  }
  Text(
    text = state.title,
    style = textStyle,
    fontSize = if (state.fontSize > 0f) state.fontSize.sp else TextUnit.Unspecified,
    fontWeight = when (state.fontWeight) {
      "regular" -> FontWeight.Normal
      "medium" -> FontWeight.Medium
      "semibold" -> FontWeight.SemiBold
      "bold" -> FontWeight.Bold
      else -> null
    },
    maxLines = 1,
    overflow = TextOverflow.Ellipsis,
  )
}

private fun Color.takeOrElse(fallback: Color) = if (this != Color.Unspecified) this else fallback

@Preview
@Composable
private fun NativeKitButtonContentPreview() {
  NativeKitButtonContent(state = NativeKitButtonState(title = "Continue", loading = true), onPress = {})
}
