package com.nameisjayant.reactnativenativekit.bottomsheet

import android.annotation.SuppressLint
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.accessibility.AccessibilityEvent
import android.widget.FrameLayout
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.IntSize
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.PixelUtil.pxToDp
import com.facebook.react.uimanager.PointerEvents
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

/**
 * Fabric host of a bottom sheet. It never draws anything itself: React children mounted into it
 * are moved into [contentRoot], which the Compose sheet hosts in its own window (modal variants)
 * or in an overlay above the React root (non-modal variants). The host's Yoga frame is only used
 * as the size of that content.
 */
@SuppressLint("ViewConstructor")
class NativeKitBottomSheetView(private val reactContext: ThemedReactContext) :
  ViewGroup(reactContext), ReactPointerEventsView {

  internal var props by mutableStateOf(NativeKitBottomSheetProps())

  /** Size of the React content in px, i.e. this host's Yoga frame. */
  internal var contentSize by mutableStateOf(IntSize.Zero)
    private set

  /** True from `visible = true` until the sheet finishes animating out. */
  private var presented by mutableStateOf(false)

  /** A user dismissal stays dismissed until JS hides and shows the sheet again. */
  private var dismissedByUser = false

  internal val contentRoot = NativeKitBottomSheetRootView(reactContext) {
    UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
  }

  private var overlay: SheetOverlay? = null

  // The host's own frame must never swallow touches meant for the views under it.
  override val pointerEvents: PointerEvents = PointerEvents.NONE

  internal fun onPropsUpdated() {
    if (!props.visible) dismissedByUser = false
    if (props.visible && !presented && !dismissedByUser) {
      presented = true
      attachOverlay()
    }
  }

  private fun attachOverlay() {
    if (overlay != null) return
    val parent = reactContext.currentActivity
      ?.findViewById<ViewGroup>(android.R.id.content) ?: return
    val newOverlay = SheetOverlay(this)
    parent.addView(
      newOverlay,
      FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    )
    overlay = newOverlay
  }

  private fun detachOverlay() {
    overlay?.let { (it.parent as? ViewGroup)?.removeView(it) }
    overlay = null
  }

  /** Called by the sheet once it is fully hidden. */
  internal fun onSheetHidden(userInitiated: Boolean) {
    presented = false
    if (userInitiated) dismissedByUser = true
    // Detach outside of the current frame: this runs from inside the overlay's composition.
    UiThreadUtil.runOnUiThread {
      if (!presented) detachOverlay()
    }
    if (userInitiated) dispatch(EVENT_DISMISS, Arguments.createMap())
  }

  internal fun onSheetStateChange(state: String) {
    dispatch(EVENT_STATE_CHANGE, Arguments.createMap().apply { putString("state", state) })
  }

  internal fun onActionPress(index: Int) {
    dispatch(EVENT_ACTION_PRESS, Arguments.createMap().apply { putInt("index", index) })
  }

  internal fun onSheetLayout(widthPx: Int, heightPx: Int) {
    dispatch(
      EVENT_LAYOUT,
      Arguments.createMap().apply {
        putDouble("width", widthPx.toFloat().pxToDp().toDouble())
        putDouble("height", heightPx.toFloat().pxToDp().toDouble())
      }
    )
  }

  /** Called when React drops the view: tear the sheet down without animating. */
  internal fun dispose() {
    presented = false
    detachOverlay()
  }

  override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
    super.onSizeChanged(w, h, oldw, oldh)
    contentSize = IntSize(w, h)
  }

  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    // Children live in contentRoot and are laid out by Fabric.
  }

  // Fabric mounts React children here; redirect them into the sheet's content root.
  override fun addView(child: View?, index: Int) {
    UiThreadUtil.assertOnUiThread()
    contentRoot.addView(child, index)
  }

  override fun getChildCount(): Int = contentRoot.childCount

  override fun getChildAt(index: Int): View? = contentRoot.getChildAt(index)

  override fun removeView(child: View?) {
    UiThreadUtil.assertOnUiThread()
    if (child != null) contentRoot.removeView(child)
  }

  override fun removeViewAt(index: Int) {
    UiThreadUtil.assertOnUiThread()
    contentRoot.removeView(getChildAt(index))
  }

  // Accessibility for the children is handled where they are actually shown, inside the sheet.
  override fun addChildrenForAccessibility(outChildren: ArrayList<View>) = Unit

  override fun dispatchPopulateAccessibilityEvent(event: AccessibilityEvent): Boolean = false

  private fun dispatch(name: String, data: WritableMap) {
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
      ?.dispatchEvent(SheetEvent(surfaceId, id, name, data))
  }

  private class SheetEvent(
    surfaceId: Int,
    viewTag: Int,
    private val name: String,
    private val data: WritableMap,
  ) : Event<SheetEvent>(surfaceId, viewTag) {
    override fun getEventName() = name
    override fun getEventData(): WritableMap = data
    override fun canCoalesce() = false
  }

  /**
   * Full-screen layer added above the React root while the sheet is presented. Modal variants
   * render into their own dialog window from here; non-modal variants draw the sheet in this
   * layer, and touches above the sheet fall through to the app underneath.
   */
  @SuppressLint("ViewConstructor")
  private class SheetOverlay(private val host: NativeKitBottomSheetView) : FrameLayout(host.context) {

    /** Top edge of the non-modal sheet in this layer's coordinates; touches above it pass through. */
    var sheetTop = Float.POSITIVE_INFINITY

    init {
      addView(
        ComposeView(context).apply {
          setContent {
            NativeKitBottomSheetContent(
              props = host.props,
              presented = host.presented,
              contentSize = host.contentSize,
              contentRoot = host.contentRoot,
              callbacks = SheetCallbacks(
                onHidden = host::onSheetHidden,
                onStateChange = host::onSheetStateChange,
                onActionPress = host::onActionPress,
                onLayout = host::onSheetLayout,
                onSheetTopChange = { sheetTop = it },
              ),
            )
          }
        },
        LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
      )
    }

    override fun dispatchTouchEvent(event: MotionEvent): Boolean {
      if (event.actionMasked == MotionEvent.ACTION_DOWN && event.y < sheetTop) return false
      return super.dispatchTouchEvent(event)
    }
  }

  companion object {
    const val EVENT_DISMISS = "topSheetDismiss"
    const val EVENT_STATE_CHANGE = "topSheetStateChange"
    const val EVENT_ACTION_PRESS = "topActionPress"
    const val EVENT_LAYOUT = "topSheetLayout"
  }
}
