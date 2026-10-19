package com.nameisjayant.reactnativenativekit

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.nameisjayant.reactnativenativekit.bottomsheet.NativeKitBottomSheetManager
import com.nameisjayant.reactnativenativekit.button.NativeKitButtonManager
import com.nameisjayant.reactnativenativekit.view.NativekitViewManager

class ReactNativeNativekitPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == ReactNativeNativekitModule.NAME) {
      ReactNativeNativekitModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      ReactNativeNativekitModule.NAME to ReactModuleInfo(
        name = ReactNativeNativekitModule.NAME,
        className = ReactNativeNativekitModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    listOf(NativekitViewManager(), NativeKitButtonManager(), NativeKitBottomSheetManager())
}
