package com.nameisjayant.reactnativenativekit.view

import android.content.Context
import android.widget.FrameLayout
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.ComposeView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

/**
 * Host view that bridges a Fabric component to Jetpack Compose. Props are held in Compose
 * state so updates from JS recompose the content instead of recreating it.
 */
class NativekitView(context: Context) : FrameLayout(context) {

  var title by mutableStateOf("")

  init {
    addView(
      ComposeView(context).apply {
        setContent {
          NativekitContent(title = title, onPress = ::dispatchPress)
        }
      },
      LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    )
  }

  // React Native lays out native views itself and drops child layout requests, so Compose
  // content that resizes (e.g. after recomposition) would never be re-measured without this.
  private val measureAndLayout = Runnable {
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
    )
    layout(left, top, right, bottom)
  }

  override fun requestLayout() {
    super.requestLayout()
    post(measureAndLayout)
  }

  private fun dispatchPress() {
    val reactContext = context as ReactContext
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
      ?.dispatchEvent(PressEvent(surfaceId, id))
  }

  private class PressEvent(surfaceId: Int, viewTag: Int) : Event<PressEvent>(surfaceId, viewTag) {
    override fun getEventName() = EVENT_PRESS
    override fun getEventData(): WritableMap = Arguments.createMap()
  }

  companion object {
    const val EVENT_PRESS = "topPress"
  }
}
