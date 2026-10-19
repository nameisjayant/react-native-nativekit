package com.nameisjayant.reactnativenativekit.bottomsheet

import android.annotation.SuppressLint
import android.view.MotionEvent
import android.view.View
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.uimanager.JSTouchDispatcher
import com.facebook.react.uimanager.RootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.view.ReactViewGroup

/**
 * Holds the sheet's React children once they are moved out of the host view and into the sheet.
 *
 * The sheet lives outside the React root view (in a dialog window or an overlay), so touches
 * never reach React's own root. Like React Native's Modal, this view acts as a [RootView] and
 * forwards touches to JS itself. Children are positioned by Fabric, so layout is a no-op.
 */
@SuppressLint("ViewConstructor")
internal class NativeKitBottomSheetRootView(
  private val reactContext: ThemedReactContext,
  private val eventDispatcher: () -> EventDispatcher?,
) : ReactViewGroup(reactContext), RootView {

  private val jsTouchDispatcher = JSTouchDispatcher(this)

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    // The sheet always passes the content size; tolerate UNSPECIFIED specs instead of asserting.
    setMeasuredDimension(
      MeasureSpec.getSize(widthMeasureSpec),
      MeasureSpec.getSize(heightMeasureSpec),
    )
  }

  override fun onInterceptTouchEvent(event: MotionEvent): Boolean {
    eventDispatcher()?.let { jsTouchDispatcher.handleTouchEvent(event, it, reactContext) }
    return super.onInterceptTouchEvent(event)
  }

  @SuppressLint("ClickableViewAccessibility")
  override fun onTouchEvent(event: MotionEvent): Boolean {
    eventDispatcher()?.let { jsTouchDispatcher.handleTouchEvent(event, it, reactContext) }
    super.onTouchEvent(event)
    // Claim the gesture even when no child wants it so JS keeps receiving its events.
    return true
  }

  @OptIn(UnstableReactNativeAPI::class)
  override fun onChildStartedNativeGesture(childView: View?, ev: MotionEvent) {
    eventDispatcher()?.let { jsTouchDispatcher.onChildStartedNativeGesture(ev, it, reactContext) }
  }

  override fun onChildEndedNativeGesture(childView: View, ev: MotionEvent) {
    eventDispatcher()?.let { jsTouchDispatcher.onChildEndedNativeGesture(ev, it) }
  }

  override fun requestDisallowInterceptTouchEvent(disallowIntercept: Boolean) {
    // Keep receiving onInterceptTouchEvent so JS sees the whole gesture, but still tell the
    // sheet (our ancestors) so it stops dragging while a child, e.g. a ScrollView, scrolls.
    parent?.requestDisallowInterceptTouchEvent(disallowIntercept)
  }

  override fun handleException(t: Throwable) {
    reactContext.reactApplicationContext.handleException(RuntimeException(t))
  }
}
