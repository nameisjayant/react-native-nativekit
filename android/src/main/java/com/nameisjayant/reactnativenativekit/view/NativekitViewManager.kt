package com.nameisjayant.reactnativenativekit.view

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativekitViewManagerDelegate
import com.facebook.react.viewmanagers.NativekitViewManagerInterface

@ReactModule(name = NativekitViewManager.NAME)
class NativekitViewManager : SimpleViewManager<NativekitView>(),
  NativekitViewManagerInterface<NativekitView> {

  private val delegate = NativekitViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<NativekitView> = delegate

  override fun getName() = NAME

  override fun createViewInstance(context: ThemedReactContext) = NativekitView(context)

  @ReactProp(name = "title")
  override fun setTitle(view: NativekitView, value: String?) {
    view.title = value.orEmpty()
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
    mapOf(NativekitView.EVENT_PRESS to mapOf("registrationName" to "onPress"))

  companion object {
    const val NAME = "NativekitView"
  }
}
