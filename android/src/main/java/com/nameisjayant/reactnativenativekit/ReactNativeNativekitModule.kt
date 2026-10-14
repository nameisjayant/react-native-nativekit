package com.nameisjayant.reactnativenativekit

import com.facebook.react.bridge.ReactApplicationContext

class ReactNativeNativekitModule(reactContext: ReactApplicationContext) :
  NativeReactNativeNativekitSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeReactNativeNativekitSpec.NAME
  }
}
