package com.nameisjayant.reactnativenativekit.button

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeKitButtonManagerDelegate
import com.facebook.react.viewmanagers.NativeKitButtonManagerInterface

@ReactModule(name = NativeKitButtonManager.NAME)
class NativeKitButtonManager : SimpleViewManager<NativeKitButtonView>(),
  NativeKitButtonManagerInterface<NativeKitButtonView> {

  private val delegate = NativeKitButtonManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<NativeKitButtonView> = delegate

  override fun getName() = NAME

  override fun createViewInstance(context: ThemedReactContext) = NativeKitButtonView(context)

  @ReactProp(name = "title")
  override fun setTitle(view: NativeKitButtonView, value: String?) {
    view.state = view.state.copy(title = value.orEmpty())
  }

  @ReactProp(name = "variant")
  override fun setVariant(view: NativeKitButtonView, value: String?) {
    view.state = view.state.copy(variant = value ?: "filled")
  }

  @ReactProp(name = "size")
  override fun setSize(view: NativeKitButtonView, value: String?) {
    view.state = view.state.copy(size = value ?: "medium")
  }

  @ReactProp(name = "color", customType = "Color")
  override fun setColor(view: NativeKitButtonView, value: Int?) {
    view.state = view.state.copy(color = value)
  }

  @ReactProp(name = "textColor", customType = "Color")
  override fun setTextColor(view: NativeKitButtonView, value: Int?) {
    view.state = view.state.copy(textColor = value)
  }

  @ReactProp(name = "disabled")
  override fun setDisabled(view: NativeKitButtonView, value: Boolean) {
    view.state = view.state.copy(disabled = value)
  }

  @ReactProp(name = "loading")
  override fun setLoading(view: NativeKitButtonView, value: Boolean) {
    view.state = view.state.copy(loading = value)
  }

  @ReactProp(name = "cornerRadius", defaultFloat = -1f)
  override fun setCornerRadius(view: NativeKitButtonView, value: Float) {
    view.state = view.state.copy(cornerRadius = value)
  }

  @ReactProp(name = "fontSize")
  override fun setFontSize(view: NativeKitButtonView, value: Float) {
    view.state = view.state.copy(fontSize = value)
  }

  @ReactProp(name = "fontWeight")
  override fun setFontWeight(view: NativeKitButtonView, value: String?) {
    view.state = view.state.copy(fontWeight = value ?: "default")
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
    mapOf(NativeKitButtonView.EVENT_PRESS to mapOf("registrationName" to "onPress"))

  companion object {
    const val NAME = "NativeKitButton"
  }
}
