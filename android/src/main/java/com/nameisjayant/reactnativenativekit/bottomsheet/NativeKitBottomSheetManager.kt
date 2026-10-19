package com.nameisjayant.reactnativenativekit.bottomsheet

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeKitBottomSheetManagerDelegate
import com.facebook.react.viewmanagers.NativeKitBottomSheetManagerInterface

@ReactModule(name = NativeKitBottomSheetManager.NAME)
class NativeKitBottomSheetManager : ViewGroupManager<NativeKitBottomSheetView>(),
  NativeKitBottomSheetManagerInterface<NativeKitBottomSheetView> {

  private val delegate = NativeKitBottomSheetManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<NativeKitBottomSheetView> = delegate

  override fun getName() = NAME

  override fun createViewInstance(context: ThemedReactContext) = NativeKitBottomSheetView(context)

  // Children are moved into the sheet, so the host must not clip or lay them out itself.
  override fun needsCustomLayoutForChildren() = true

  @ReactProp(name = "visible")
  override fun setVisible(view: NativeKitBottomSheetView, value: Boolean) {
    view.props = view.props.copy(visible = value)
  }

  @ReactProp(name = "variant")
  override fun setVariant(view: NativeKitBottomSheetView, value: String?) {
    view.props = view.props.copy(variant = value ?: "modal")
  }

  @ReactProp(name = "dismissible", defaultBoolean = true)
  override fun setDismissible(view: NativeKitBottomSheetView, value: Boolean) {
    view.props = view.props.copy(dismissible = value)
  }

  @ReactProp(name = "showDragHandle", defaultBoolean = true)
  override fun setShowDragHandle(view: NativeKitBottomSheetView, value: Boolean) {
    view.props = view.props.copy(showDragHandle = value)
  }

  @ReactProp(name = "cornerRadius", defaultFloat = -1f)
  override fun setCornerRadius(view: NativeKitBottomSheetView, value: Float) {
    view.props = view.props.copy(cornerRadius = value)
  }

  @ReactProp(name = "sheetBackgroundColor", customType = "Color")
  override fun setSheetBackgroundColor(view: NativeKitBottomSheetView, value: Int?) {
    view.props = view.props.copy(backgroundColor = value)
  }

  @ReactProp(name = "peekHeight")
  override fun setPeekHeight(view: NativeKitBottomSheetView, value: Float) {
    view.props = view.props.copy(peekHeight = value)
  }

  @ReactProp(name = "title")
  override fun setTitle(view: NativeKitBottomSheetView, value: String?) {
    view.props = view.props.copy(title = value.orEmpty())
  }

  @ReactProp(name = "message")
  override fun setMessage(view: NativeKitBottomSheetView, value: String?) {
    view.props = view.props.copy(message = value.orEmpty())
  }

  @ReactProp(name = "actions")
  override fun setActions(view: NativeKitBottomSheetView, value: ReadableArray?) {
    val actions = (0 until (value?.size() ?: 0)).mapNotNull { index ->
      value?.getMap(index)?.let { map ->
        NativeKitSheetAction(
          title = if (map.hasKey("title")) map.getString("title").orEmpty() else "",
          role = if (map.hasKey("role")) map.getString("role") ?: "default" else "default",
          disabled = map.hasKey("disabled") && !map.isNull("disabled") && map.getBoolean("disabled"),
        )
      }
    }
    view.props = view.props.copy(actions = actions)
  }

  override fun onAfterUpdateTransaction(view: NativeKitBottomSheetView) {
    super.onAfterUpdateTransaction(view)
    view.onPropsUpdated()
  }

  override fun onDropViewInstance(view: NativeKitBottomSheetView) {
    view.dispose()
    super.onDropViewInstance(view)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> = mapOf(
    NativeKitBottomSheetView.EVENT_DISMISS to mapOf("registrationName" to "onSheetDismiss"),
    NativeKitBottomSheetView.EVENT_STATE_CHANGE to mapOf("registrationName" to "onSheetStateChange"),
    NativeKitBottomSheetView.EVENT_ACTION_PRESS to mapOf("registrationName" to "onActionPress"),
    NativeKitBottomSheetView.EVENT_LAYOUT to mapOf("registrationName" to "onSheetLayout"),
  )

  companion object {
    const val NAME = "NativeKitBottomSheet"
  }
}
