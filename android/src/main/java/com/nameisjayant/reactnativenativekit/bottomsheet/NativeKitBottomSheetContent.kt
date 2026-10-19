package com.nameisjayant.reactnativenativekit.bottomsheet

import android.view.View
import android.view.ViewGroup
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.requiredSize
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.BottomSheetDefaults
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ListItem
import androidx.compose.material3.ListItemDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.ModalBottomSheetProperties
import androidx.compose.material3.SheetState
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

internal data class NativeKitSheetAction(
  val title: String,
  val role: String = "default",
  val disabled: Boolean = false,
)

/** Snapshot of the props sent from JS. Colors are ARGB ints, `null` meaning "use the default". */
internal data class NativeKitBottomSheetProps(
  val visible: Boolean = false,
  val variant: String = "modal",
  val dismissible: Boolean = true,
  val showDragHandle: Boolean = true,
  val cornerRadius: Float = -1f,
  val backgroundColor: Int? = null,
  val peekHeight: Float = 0f,
  val title: String = "",
  val message: String = "",
  val actions: List<NativeKitSheetAction> = emptyList(),
) {
  val isModal get() = variant != "persistent" && variant != "expandable"
  val fillsHeight get() = variant == "halfExpanded" || variant == "expanded" || variant == "fullScreen"
}

internal class SheetCallbacks(
  val onHidden: (userInitiated: Boolean) -> Unit,
  val onStateChange: (String) -> Unit,
  val onActionPress: (Int) -> Unit,
  val onLayout: (widthPx: Int, heightPx: Int) -> Unit,
  val onSheetTopChange: (Float) -> Unit,
)

private val DefaultPeekHeight = 120.dp

@Composable
internal fun NativeKitBottomSheetContent(
  props: NativeKitBottomSheetProps,
  presented: Boolean,
  contentSize: IntSize,
  contentRoot: View,
  callbacks: SheetCallbacks,
) {
  val colorScheme = if (isSystemInDarkTheme()) darkColorScheme() else lightColorScheme()
  MaterialTheme(colorScheme = colorScheme) {
    if (!presented) return@MaterialTheme
    // A different variant needs a differently configured sheet state, so start over.
    key(props.variant) {
      if (props.isModal) {
        ModalSheet(props, contentSize, contentRoot, callbacks)
      } else {
        StandardSheet(props, contentSize, contentRoot, callbacks)
      }
    }
  }
}

/** `modal`, `halfExpanded`, `expanded`, `fullScreen` and `actionSheet`: a Material 3 [ModalBottomSheet]. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ModalSheet(
  props: NativeKitBottomSheetProps,
  contentSize: IntSize,
  contentRoot: View,
  callbacks: SheetCallbacks,
) {
  val latestProps by rememberUpdatedState(props)
  val hideGuard = remember { HideGuard() }
  val fullScreen = props.variant == "fullScreen"
  val sheetState = rememberModalBottomSheetState(
    skipPartiallyExpanded = props.variant != "halfExpanded",
    confirmValueChange = { it != SheetValue.Hidden || latestProps.dismissible || hideGuard.allowed },
  )
  val scope = rememberCoroutineScope()

  SheetVisibilityEffect(props.visible, sheetState, hideGuard, callbacks)
  SheetStateEffect(sheetState, collapsedName = "halfExpanded", callbacks)

  ModalBottomSheet(
    onDismissRequest = {
      // Back/scrim dismissals land here once hidden; ignore vetoed attempts that stayed visible.
      if (!sheetState.isVisible) callbacks.onHidden(true)
    },
    modifier = if (props.fillsHeight) Modifier.fillMaxHeight() else Modifier,
    sheetState = sheetState,
    sheetMaxWidth = if (fullScreen) Dp.Unspecified else BottomSheetDefaults.SheetMaxWidth,
    sheetGesturesEnabled = props.dismissible || props.variant == "halfExpanded",
    shape = sheetShape(props, square = fullScreen),
    containerColor = props.backgroundColor?.let(::Color) ?: BottomSheetDefaults.ContainerColor,
    dragHandle = if (props.showDragHandle && !fullScreen && props.variant != "actionSheet") {
      { BottomSheetDefaults.DragHandle() }
    } else {
      null
    },
    contentWindowInsets = {
      if (fullScreen) WindowInsets.safeDrawing else BottomSheetDefaults.windowInsets
    },
    properties = ModalBottomSheetProperties(
      shouldDismissOnBackPress = props.dismissible,
      shouldDismissOnClickOutside = props.dismissible,
    ),
  ) {
    if (props.variant == "actionSheet") {
      ActionSheetBody(props) { index ->
        callbacks.onActionPress(index)
        hideGuard.allowed = true
        scope.launch { sheetState.hide() }.invokeOnCompletion {
          if (!sheetState.isVisible) callbacks.onHidden(true)
        }
      }
    } else {
      ReactContent(props.fillsHeight, contentSize, contentRoot, callbacks.onLayout)
    }
  }
}

/** `persistent` and `expandable`: a non-modal Material 3 standard sheet that leaves the app usable. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun StandardSheet(
  props: NativeKitBottomSheetProps,
  contentSize: IntSize,
  contentRoot: View,
  callbacks: SheetCallbacks,
) {
  val latestProps by rememberUpdatedState(props)
  val hideGuard = remember { HideGuard() }
  val sheetState = rememberStandardBottomSheetState(
    initialValue = SheetValue.Hidden,
    // Persistent sheets only hide when JS asks; expandable ones can also be swiped away.
    confirmValueChange = {
      it != SheetValue.Hidden || hideGuard.allowed ||
        (latestProps.variant == "expandable" && latestProps.dismissible)
    },
    skipHiddenState = false,
  )
  val peekHeight = if (props.peekHeight > 0f) props.peekHeight.dp else DefaultPeekHeight

  SheetVisibilityEffect(props.visible, sheetState, hideGuard, callbacks)
  SheetStateEffect(sheetState, collapsedName = "collapsed", callbacks)

  // Swiping an expandable sheet down to hidden is a user dismissal.
  LaunchedEffect(sheetState) {
    snapshotFlow { sheetState.currentValue }
      .distinctUntilChanged()
      .collect { value ->
        if (value == SheetValue.Hidden && sheetState.targetValue == SheetValue.Hidden &&
          latestProps.visible && !hideGuard.allowed && hideGuard.wasShown
        ) {
          callbacks.onHidden(true)
        }
        if (value != SheetValue.Hidden) hideGuard.wasShown = true
      }
  }

  // Let touches outside the sheet reach the app underneath.
  LaunchedEffect(sheetState) {
    snapshotFlow { runCatching { sheetState.requireOffset() }.getOrNull() }
      .collect { callbacks.onSheetTopChange(it ?: Float.POSITIVE_INFINITY) }
  }

  BottomSheetScaffold(
    sheetContent = {
      Column(Modifier.navigationBarsPadding()) {
        ReactContent(fillsHeight = false, contentSize, contentRoot, callbacks.onLayout)
      }
    },
    scaffoldState = rememberBottomSheetScaffoldState(bottomSheetState = sheetState),
    sheetPeekHeight = peekHeight,
    sheetShape = sheetShape(props, square = false),
    sheetContainerColor = props.backgroundColor?.let(::Color) ?: BottomSheetDefaults.ContainerColor,
    sheetDragHandle = if (props.showDragHandle) {
      { BottomSheetDefaults.DragHandle() }
    } else {
      null
    },
    containerColor = Color.Transparent,
    content = {},
  )
}

/** Lets JS-driven hides through `confirmValueChange` even when the user may not dismiss. */
private class HideGuard {
  var allowed = false
  var wasShown = false
}

/** Shows the sheet when `visible` turns on and animates it out (then reports it) when it turns off. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SheetVisibilityEffect(
  visible: Boolean,
  sheetState: SheetState,
  hideGuard: HideGuard,
  callbacks: SheetCallbacks,
) {
  LaunchedEffect(visible) {
    if (visible) {
      hideGuard.allowed = false
      // Animating before the sheet is measured would snap it open, so wait for its anchors.
      snapshotFlow { sheetState.hasExpandedState || sheetState.hasPartiallyExpandedState }
        .first { it }
      if (sheetState.targetValue == SheetValue.Hidden) sheetState.show()
    } else {
      hideGuard.allowed = true
      sheetState.hide()
      callbacks.onHidden(false)
    }
  }
}

/** Reports each settled position (`hidden` excluded: dismissals are reported separately). */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SheetStateEffect(
  sheetState: SheetState,
  collapsedName: String,
  callbacks: SheetCallbacks,
) {
  LaunchedEffect(sheetState) {
    snapshotFlow { sheetState.currentValue }
      .distinctUntilChanged()
      .drop(1) // the initial Hidden value
      .collect { value ->
        callbacks.onStateChange(
          when (value) {
            SheetValue.Hidden -> "hidden"
            SheetValue.PartiallyExpanded -> collapsedName
            SheetValue.Expanded -> "expanded"
          }
        )
      }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun sheetShape(props: NativeKitBottomSheetProps, square: Boolean): Shape = when {
  square -> RectangleShape
  props.cornerRadius >= 0f ->
    RoundedCornerShape(topStart = props.cornerRadius.dp, topEnd = props.cornerRadius.dp)
  else -> BottomSheetDefaults.ExpandedShape
}

/**
 * Hosts the React children. They are laid out by Yoga at the host's size, so the view gets exactly
 * that size; the space the sheet offers is reported back so JS can size the content to it.
 */
@Composable
private fun ColumnScope.ReactContent(
  fillsHeight: Boolean,
  contentSize: IntSize,
  contentRoot: View,
  onLayout: (Int, Int) -> Unit,
) {
  val density = LocalDensity.current
  BoxWithConstraints(
    Modifier.fillMaxWidth().then(if (fillsHeight) Modifier.weight(1f) else Modifier)
  ) {
    val maxWidthPx = constraints.maxWidth
    val maxHeightPx = if (constraints.hasBoundedHeight) constraints.maxHeight else contentSize.height
    LaunchedEffect(maxWidthPx, maxHeightPx) { onLayout(maxWidthPx, maxHeightPx) }

    AndroidView(
      factory = {
        // The root may still be attached to the previous sheet's (disposed) holder.
        (contentRoot.parent as? ViewGroup)?.removeView(contentRoot)
        contentRoot
      },
      modifier = with(density) {
        Modifier.requiredSize(contentSize.width.toDp(), contentSize.height.toDp())
      },
    )
  }
}

@Composable
private fun ColumnScope.ActionSheetBody(props: NativeKitBottomSheetProps, onAction: (Int) -> Unit) {
  val indexed = props.actions.withIndex()
  val (cancel, regular) = indexed.partition { it.value.role == "cancel" }

  Column(Modifier.fillMaxWidth().padding(bottom = 8.dp)) {
    if (props.title.isNotEmpty() || props.message.isNotEmpty()) {
      Column(Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp)) {
        if (props.title.isNotEmpty()) {
          Text(
            text = props.title,
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Start,
          )
        }
        if (props.message.isNotEmpty()) {
          if (props.title.isNotEmpty()) Spacer(Modifier.height(4.dp))
          Text(
            text = props.message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
          )
        }
      }
      HorizontalDivider()
    } else {
      Spacer(Modifier.height(8.dp))
    }
    regular.forEach { (index, action) -> ActionRow(action) { onAction(index) } }
    if (cancel.isNotEmpty()) {
      HorizontalDivider(Modifier.padding(vertical = 4.dp))
      cancel.forEach { (index, action) -> ActionRow(action) { onAction(index) } }
    }
  }
}

@Composable
private fun ActionRow(action: NativeKitSheetAction, onClick: () -> Unit) {
  val base =
    if (action.role == "destructive") MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface
  val color = if (action.disabled) base.copy(alpha = 0.38f) else base
  ListItem(
    headlineContent = {
      Text(
        text = action.title,
        fontWeight = if (action.role == "cancel") FontWeight.SemiBold else null,
      )
    },
    modifier = Modifier
      .fillMaxWidth()
      .clickable(enabled = !action.disabled, onClick = onClick),
    colors = ListItemDefaults.colors(
      containerColor = Color.Transparent,
      headlineColor = color,
    ),
  )
}
