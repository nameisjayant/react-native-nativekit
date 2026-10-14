package com.nameisjayant.reactnativenativekit.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview

@Composable
internal fun NativekitContent(title: String, onPress: () -> Unit) {
  MaterialTheme {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
      Button(onClick = onPress) {
        Text(text = title)
      }
    }
  }
}

@Preview
@Composable
private fun NativekitContentPreview() {
  NativekitContent(title = "Hello from Compose", onPress = {})
}
